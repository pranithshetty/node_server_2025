const express = require('express')
const { handleUserSignUp, handleUserLogin, handleGoogleLogin } = require('../controllers/user')
const router = express.Router()

router
    .post('/signup', handleUserSignUp)
    .post('/login', handleUserLogin)
    .post('/google-login', handleGoogleLogin)

module.exports = router;