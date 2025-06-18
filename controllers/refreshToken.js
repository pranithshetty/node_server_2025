const {
    generateAccessToken,
    verifyRefreshToken,
} = require('../services/tokenServices');
const RefreshToken = require('../models/refreshToken');

const handleRefreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    try {
        const decoded = verifyRefreshToken(token);
        const savedToken = await RefreshToken.findOne({ token });

        if (!savedToken || savedToken.userId.toString() !== decoded.id) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        const accessToken = generateAccessToken(decoded.id);
        res.json({ accessToken });
    } catch (err) {
        console.error(err.message);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};

module.exports = handleRefreshToken;
