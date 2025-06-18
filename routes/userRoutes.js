const express = require('express');
const {
    handleUserSignUp,
    handleUserLogin,
    handleGoogleLogin,
    handleUserLogout,
} = require('../controllers/user');
const router = express.Router();

router
    .post('/signup', handleUserSignUp)
    .post('/login', handleUserLogin)
    .post('/google-login', handleGoogleLogin)
    .post('/logout', handleUserLogout);

module.exports = router;
