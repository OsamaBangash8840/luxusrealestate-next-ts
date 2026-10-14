const fs = require('fs');
const path = require('path');

const basePath = 'd:/Clones/luxus-main-apis/server_clone';

// 1. Create models/CronLock.js
const cronLockCode = `const mongoose = require('mongoose');

const CronLockSchema = new mongoose.Schema({
    jobName: { type: String, required: true, unique: true },
    lockedUntil: { type: Date, required: true },
    lockedBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('CronLock', CronLockSchema);
`;
fs.writeFileSync(path.join(basePath, 'models/CronLock.js'), cronLockCode, 'utf8');

// 2. Update models/RefreshToken.js to add isRevoked
const refreshTokenModelCode = `const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false }
}, { timestamps: true });

// TTL index to automatically remove expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
`;
fs.writeFileSync(path.join(basePath, 'models/RefreshToken.js'), refreshTokenModelCode, 'utf8');

// 3. Update models/User.js to add passwordChangedAt
let userModel = fs.readFileSync(path.join(basePath, 'models/User.js'), 'utf8');
if (!userModel.includes('passwordChangedAt')) {
    userModel = userModel.replace(
        'resetPasswordExpires: Date,',
        'resetPasswordExpires: Date,\n    passwordChangedAt: Date,'
    );
    fs.writeFileSync(path.join(basePath, 'models/User.js'), userModel, 'utf8');
}

// 4. Update middlewares/verifyToken.js
const verifyTokenCode = `const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { STATUS_CODES, MESSAGES } = require('../config/constants');

// Middleware to verify the token from cookies or authorization header
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED || 'Access denied. Please log in.');
    }

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);

    // Verify user exists and check for password reset invalidation
    const user = await User.findById(verified.id).select('+isBanned +passwordChangedAt');
    if (!user || user.isBanned) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found or account is deactivated');
    }

    // Invalidate session if password was reset after token was issued
    if (user.passwordChangedAt && verified.iat && verified.iat * 1000 < user.passwordChangedAt.getTime()) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Session expired. Password was recently changed, please log in again.');
    }

    req.user = verified;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

module.exports = verifyToken;
`;
fs.writeFileSync(path.join(basePath, 'middlewares/verifyToken.js'), verifyTokenCode, 'utf8');

console.log('Step 1-4 applied successfully!');
