const fs = require('fs');
const targetFile = 'd:/Clones/luxus-main-apis/server_clone/socketConnection.js';
const content = fs.readFileSync(targetFile, 'utf8');

const targetBlockRegex = /\/\/ Update offer status[\s\S]*?if \(!message\.offerDetails\) \{[\s\S]*?message\.offerDetails = \{\};[\s\S]*?\}[\s\S]*?message\.offerDetails\.status = status;[\s\S]*?if \(notes\) message\.offerDetails\.notes = notes;[\s\S]*?await message\.save\(\);[\s\S]*?\/\/ If offer is accepted, update property status[\s\S]*?if \(status === 'accepted'\) \{[\s\S]*?await Property\.findByIdAndUpdate\(conversation\.propertyId, \{[\s\S]*?propertyStatus: 'under offer'[\s\S]*?\}\);[\s\S]*?\/\/ Reject other open offers for this property[\s\S]*?const otherConvos = await Conversation\.find\(\{ propertyId: conversation\.propertyId, _id: \{ \$ne: conversation\._id \} \}\);[\s\S]*?for \(const c of otherConvos\) \{[\s\S]*?const pendingOffer = await Message\.findOne\(\{ conversationId: c\._id, isOffer: true, 'offerDetails\.status': 'pending' \}\);[\s\S]*?if \(pendingOffer\) \{[\s\S]*?pendingOffer\.offerDetails\.status = 'rejected';[\s\S]*?pendingOffer\.offerDetails\.notes = 'Property is under offer with another buyer';[\s\S]*?await pendingOffer\.save\(\);[\s\S]*?await createNotification\(c\.buyerId, \{ type: 'offer', content: 'Your offer was rejected because the property is under offer\.', relatedId: pendingOffer\._id \}\);[\s\S]*?\}[\s\S]*?\}[\s\S]*?\}/;

const replacementBlock = `// ATOMIC OFFER RESOLUTION: Ensure two offers cannot both win
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
                    // Rollback property status if offer was already resolved by another action
                    await Property.findByIdAndUpdate(conversation.propertyId, { propertyStatus: 'for sale' });
                    socket.emit('error', { message: 'Offer is no longer pending or has already been resolved' });
                    return;
                }

                // 3. Atomically reject all other open offers for this property across all conversations
                const otherConvos = await Conversation.find({ propertyId: conversation.propertyId, _id: { $ne: conversation._id } });
                for (const c of otherConvos) {
                    const pendingOffers = await Message.find({ conversationId: c._id, isOffer: true, 'offerDetails.status': 'pending' });
                    for (const po of pendingOffers) {
                        po.offerDetails.status = 'rejected';
                        po.offerDetails.notes = 'Property is under offer with another buyer';
                        await po.save();
                        await createNotification(c.buyerId, { type: 'offer', content: 'Your offer was rejected because the property is under offer with another buyer.', relatedId: po._id });
                    }
                }
            } else {
                // For rejections or counter-offers
                if (!message.offerDetails) {
                    message.offerDetails = {};
                }
                message.offerDetails.status = status;
                if (notes) message.offerDetails.notes = notes;
                await message.save();
            }`;

if (targetBlockRegex.test(content)) {
    const updated = content.replace(targetBlockRegex, replacementBlock);
    fs.writeFileSync(targetFile, updated, 'utf8');
    console.log('SUCCESS: socketConnection.js updated with atomic offer acceptance!');
} else {
    console.log('FAILED: regex did not match block in socketConnection.js');
}
