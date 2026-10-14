const fs = require('fs');
const path = require('path');

const basePath = 'd:/Clones/luxus-main-apis/server_clone';

// 1. Update controllers/auth.controller.js
let authContent = fs.readFileSync(path.join(basePath, 'controllers/auth.controller.js'), 'utf8');

// In ResetPass, add user.passwordChangedAt = new Date();
const oldResetPassRegex = /user\.password\s*=\s*await\s*bcrypt\.hash\(password,\s*10\);[\s\S]*?await\s*user\.save\(\);/;
const newResetPassCode = `user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = new Date();
    await user.save();`;

authContent = authContent.replace(oldResetPassRegex, newResetPassCode);

// In refreshToken, add reuse detection
const oldRefreshTokenRegex = /module\.exports\.refreshToken\s*=\s*asyncHandler\(async\s*\(req,\s*res\)\s*=>\s*\{[\s\S]*?res\.status\(STATUS_CODES\.OK\)\.json\(new ApiResponse\(STATUS_CODES\.OK,\s*null,\s*'Token refreshed successfully'\)\);\s*\}\);/;

const newRefreshTokenCode = `module.exports.refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Refresh token not found');
    }

    let userId;
    const { token } = req.cookies;
    if (token) {
        try {
            const decoded = jwt.decode(token);
            if (decoded) userId = decoded.id;
        } catch (e) {}
    }

    if (!userId) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Cannot identify user for refresh');
    }

    // Find all valid (unexpired) refresh tokens for this user
    const tokens = await RefreshToken.find({ userId }).where('expiresAt').gt(new Date());
    let matchedToken = null;

    for (const t of tokens) {
        const isMatch = await bcrypt.compare(refreshToken, t.tokenHash);
        if (isMatch) {
            matchedToken = t;
            break;
        }
    }

    if (!matchedToken) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    // REUSE DETECTION: If this token was already rotated/revoked, an attacker is replaying it!
    if (matchedToken.isRevoked) {
        logger.warn('SECURITY ALERT: Refresh token reuse detected! Revoking all sessions for user', { userId });
        await RefreshToken.deleteMany({ userId });
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Security Alert: Refresh token reuse detected. All active sessions have been terminated.');
    }

    const user = await User.findById(userId);
    if (!user || user.isBanned) {
        throw new ApiError(STATUS_CODES.FORBIDDEN, 'User banned or deleted');
    }

    // Invalidate current token by marking it revoked
    matchedToken.isRevoked = true;
    await matchedToken.save();
    
    // Issue rotated token pair
    const newAccessToken = generateAuthToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    const salt = await bcrypt.genSalt(10);
    const tokenHash = await bcrypt.hash(newRefreshToken, salt);
    await RefreshToken.create({
        userId: user._id,
        tokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isRevoked: false
    });

    setAuthCookie(res, newAccessToken, newRefreshToken);
    res.status(STATUS_CODES.OK).json(new ApiResponse(STATUS_CODES.OK, null, 'Token refreshed successfully'));
});`;

authContent = authContent.replace(oldRefreshTokenRegex, newRefreshTokenCode);
fs.writeFileSync(path.join(basePath, 'controllers/auth.controller.js'), authContent, 'utf8');

console.log('auth.controller.js updated with password reset revocation and token reuse detection!');
