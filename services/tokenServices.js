const jwt = require('jsonwebtoken');

const generateAccessToken = (id, expiry = '15m') => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: expiry,
    });
};

const generateRefreshToken = (id, expiry = '2d') => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: expiry,
    });
};

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or malformed token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        console.error(err);
        return null;
    }
};

module.exports = {
    verifyAccessToken,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
};
