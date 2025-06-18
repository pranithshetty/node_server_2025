const { generateAccessToken, verifyRefreshToken } = require("../services/tokenServices");

const handleRefreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
  
    if (!token) {
      return res.status(401).json({ error: 'No refresh token' });
    }
  
    const decoded = verifyRefreshToken(token);
  
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
  
    const newAccessToken = generateAccessToken(decoded.id);
    res.json({ accessToken: newAccessToken });
  };

  module.exports = handleRefreshToken;