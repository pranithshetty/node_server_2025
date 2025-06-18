const express = require('express')
const { handleUserSignUp, handleUserLogin, handleGoogleLogin } = require('../controllers/user')
const router = express.Router()

router
    .post('/signup', handleUserSignUp)
    .post('/login', handleUserLogin)
    .post('/google-login', handleGoogleLogin)
    .post('/logout', (req, res) => {
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,         
          sameSite: 'None',     
          path: '/',
        });
      
        res.sendStatus(204);
      });

module.exports = router;