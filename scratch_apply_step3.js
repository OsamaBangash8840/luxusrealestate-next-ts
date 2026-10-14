const fs = require('fs');
const path = require('path');

const basePath = 'd:/Clones/luxus-main-apis/server_clone';

// 1. Update jobs/cronJobs.js
const cronJobsCode = `const cron = require('node-cron');
const SavedSearch = require('../models/SavedSearch');
const Tour = require('../models/Tour');
const { Property } = require('../models/Property');
const User = require('../models/User');
const CronLock = require('../models/CronLock');
const sendEmail = require('../utils/email');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const os = require('os');

/**
 * Acquire a distributed lock via MongoDB to ensure scheduled jobs run on only one server in cluster/multi-server setups
 */
const acquireDistributedLock = async (jobName, leaseMs = 30 * 60 * 1000) => {
    const now = new Date();
    const lockedUntil = new Date(now.getTime() + leaseMs);
    const workerId = \`\${process.pid}-\${os.hostname()}-\${Date.now()}\`;

    try {
        const lock = await CronLock.findOneAndUpdate(
            {
                jobName,
                \$or: [
                    { lockedUntil: { \$lte: now } },
                    { lockedUntil: { \$exists: false } }
                ]
            },
            {
                \$set: { jobName, lockedUntil, lockedBy: workerId }
            },
            { upsert: true, new: true }
        );
        return !!lock;
    } catch (err) {
        // E11000 duplicate key error means another server won the race
        return false;
    }
};

const initCronJobs = () => {
    // Run daily at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
        const hasLock = await acquireDistributedLock('saved_search_alerts', 30 * 60 * 1000);
        if (!hasLock) {
            logger.info('Saved search alerts: Another server holds the lock. Skipping execution on this instance.');
            return;
        }

        logger.info('Running saved search alerts cron job...');
        try {
            const searches = await SavedSearch.find({}).populate('userId', 'email username');
            
            for (const search of searches) {
                if (!search.userId) continue;

                // Build query based on filters
                const query = {
                    status: 'approved',
                    createdAt: mongoose.trusted({ \$gt: search.lastAlertSentAt }) // only new properties since last alert
                };

                const f = search.filters || {};
                if (f.search) {
                    query.\$or = [
                        { title: { \$regex: f.search, \$options: 'i' } },
                        { description: { \$regex: f.search, \$options: 'i' } }
                    ];
                }
                if (f.category) query.category = f.category;
                if (f.minPrice || f.maxPrice) {
                    query.price = {};
                    if (f.minPrice) query.price.\$gte = f.minPrice;
                    if (f.maxPrice) query.price.\$lte = f.maxPrice;
                    query.price = mongoose.trusted(query.price);
                }
                if (f.bedrooms) query.bedrooms = mongoose.trusted({ \$gte: f.bedrooms });
                if (f.bathrooms) query.bathrooms = mongoose.trusted({ \$gte: f.bathrooms });

                const newProperties = await Property.find(query).limit(10);

                if (newProperties.length > 0) {
                    // Send email
                    const propertyList = newProperties.map(p => \`- \${p.title} (\$\${p.price})\`).join('\\n');
                    const message = \`Hi \${search.userId.username},\\n\\nWe found \${newProperties.length} new properties matching your saved search "\${search.name}":\\n\\n\${propertyList}\\n\\nCheck them out on Luxus Real Estate!\`;
                    
                    await sendEmail({
                        email: search.userId.email,
                        subject: \`New properties found for your saved search: \${search.name}\`,
                        message
                    });

                    // Update lastAlertSentAt
                    search.lastAlertSentAt = new Date();
                    await search.save();
                }
            }
            logger.info('Saved search alerts cron job completed.');
        } catch (error) {
            logger.error('Error running saved search alerts cron job:', error);
        }
    });

    // Tour Reminders: Run every hour
    cron.schedule('0 * * * *', async () => {
        const hasLock = await acquireDistributedLock('tour_reminders', 45 * 60 * 1000);
        if (!hasLock) {
            logger.info('Tour reminders: Another server holds the lock. Skipping execution on this instance.');
            return;
        }

        logger.info('Running tour reminders cron job...');
        try {
            const now = new Date();
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            
            const upcomingTours = await Tour.find({
                status: 'scheduled',
                startTime: mongoose.trusted({
                    \$gte: tomorrow,
                    \$lt: new Date(tomorrow.getTime() + 60 * 60 * 1000)
                }),
                reminderSent: mongoose.trusted({ \$ne: true })
            }).populate('propertyId');

            for (const tour of upcomingTours) {
                await sendEmail({
                    email: tour.email,
                    subject: \`Reminder: Upcoming tour for \${tour.propertyId.title}\`,
                    message: \`Hi \${tour.name},\\n\\nThis is a reminder for your scheduled tour of \${tour.propertyId.title} on \${tour.date.toDateString()} at \${tour.startTime.toTimeString()}.\\n\\nSee you there!\`
                });

                tour.reminderSent = true;
                await tour.save();
            }
            logger.info('Tour reminders cron job completed.');
        } catch (error) {
            logger.error('Error running tour reminders cron job:', error);
        }
    });
};

module.exports = initCronJobs;
`;
fs.writeFileSync(path.join(basePath, 'jobs/cronJobs.js'), cronJobsCode, 'utf8');

// 2. Update socketConnection.js with atomic offer acceptance
let socketContent = fs.readFileSync(path.join(basePath, 'socketConnection.js'), 'utf8');

const oldOfferBlock = `            // If offer is accepted, update property status
            if (status === 'accepted') {
                await Property.findByIdAndUpdate(conversation.propertyId, {
                    propertyStatus: 'under offer'
                });

                // Reject other open offers for this property
                const otherConvos = await Conversation.find({ propertyId: conversation.propertyId, _id: { $ne: conversation._id } });
                for (const c of otherConvos) {
                    const pendingOffer = await Message.findOne({ conversationId: c._id, isOffer: true, 'offerDetails.status': 'pending' });
                    if (pendingOffer) {
                        pendingOffer.offerDetails.status = 'rejected';
                        pendingOffer.offerDetails.notes = 'Property is under offer with another buyer';
                        await pendingOffer.save();
                        await createNotification(c.buyerId, { type: 'offer', content: 'Your offer was rejected because the property is under offer.', relatedId: pendingOffer._id });
                    }
                }
            }`;

const newAtomicOfferBlock = `            // ATOMIC OFFER ACCEPTANCE: Prevent race conditions where two offers can both win
            if (status === 'accepted') {
                // 1. Atomically lock the property to 'under offer' ONLY IF it is currently 'for sale'
                const lockedProperty = await Property.findOneAndUpdate(
                    {
                        _id: conversation.propertyId,
                        propertyStatus: 'for sale'
                    },
                    {
                        $set: { propertyStatus: 'under offer' }
                    },
                    { new: true }
                );

                if (!lockedProperty) {
                    socket.emit('error', { message: 'Cannot accept offer: Property is already under offer with another buyer or no longer available' });
                    return;
                }

                // 2. Atomically update this offer status to 'accepted' ONLY IF it is still pending or countered
                const updatedOffer = await Message.findOneAndUpdate(
                    {
                        _id: messageId,
                        isOffer: true,
                        'offerDetails.status': { $in: ['pending', 'countered'] }
                    },
                    {
                        $set: {
                            'offerDetails.status': 'accepted',
                            ...(notes && { 'offerDetails.notes': notes })
                        }
                    },
                    { new: true }
                );

                if (!updatedOffer) {
                    // Rollback property lock if the offer itself was already resolved
                    await Property.findByIdAndUpdate(conversation.propertyId, { propertyStatus: 'for sale' });
                    socket.emit('error', { message: 'Offer is no longer pending or has already been resolved' });
                    return;
                }

                // 3. Atomically reject all competing open offers for this property
                const otherConvos = await Conversation.find({ propertyId: conversation.propertyId, _id: { $ne: conversation._id } });
                for (const c of otherConvos) {
                    const pendingOffers = await Message.find({ conversationId: c._id, isOffer: true, 'offerDetails.status': 'pending' });
                    for (const pendingOffer of pendingOffers) {
                        pendingOffer.offerDetails.status = 'rejected';
                        pendingOffer.offerDetails.notes = 'Property is under offer with another buyer';
                        await pendingOffer.save();
                        await createNotification(c.buyerId, { type: 'offer', content: 'Your offer was rejected because the property is under offer with another buyer.', relatedId: pendingOffer._id });
                    }
                }
            } else {
                // Rejection or counter-offer
                message.offerDetails.status = status;
                if (notes) message.offerDetails.notes = notes;
                await message.save();
            }`;

if (socketContent.includes(oldOfferBlock)) {
    socketContent = socketContent.replace(oldOfferBlock, newAtomicOfferBlock);
    fs.writeFileSync(path.join(basePath, 'socketConnection.js'), socketContent, 'utf8');
    console.log('socketConnection.js updated with atomic offer acceptance!');
} else {
    console.log('Warning: could not locate exact old offer block in socketConnection.js');
}

console.log('cronJobs.js updated with distributed locking!');
