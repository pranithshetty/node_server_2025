const User = require('../models/users');
const RefreshToken = require('../models/refreshToken');
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../services/tokenServices');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function handleUserSignUp(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'Missing required fields' });

        const userExists = await User.findOne({
            email,
        });

        if (userExists?.email) {
            //res.status(400)
            //throe new Error('Account already exists"')
            return res.status(400).json({ error: 'Account already exists' });
        }
        const user = await User.create({
            email,
            password,
        });

        if (user) {
            return res.status(201).send({
                id: user._id,
                email: user.email,
            });
        } else {
            return res.status(400).json({ error: 'Error registering' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
        email,
    });
    if (user && (await user.matchPasswords(password))) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await RefreshToken.create({
            token: refreshToken,
            userId: user._id,
            expiresAt,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env === 'production' ? 'Strict' : 'None',
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            path: '/', //musr match exacty or else logout wont work
        })
            .status(200)
            .json({
                id: user._id,
                email: user.email,
                accessToken,
            });
    } else {
        res.status(400).json({ error: 'Invalid username or password' });
    }
}

async function handleGoogleLogin(req, res) {
    const { idToken } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const googleId = payload.sub;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                password: googleId,
            });
            res.status(201);
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await RefreshToken.create({
            token: refreshToken,
            userId: user._id,
            expiresAt,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: process.env === 'production' ? 'Strict' : 'None',
            maxAge: 2 * 24 * 60 * 60 * 1000,
            path: '/', //musr match exacty or else logout wont work
        })
            .status(200)
            .json({
                id: user._id,
                email: user.email,
                accessToken,
            });
    } catch (err) {
        console.error('Google login failed', err);
        res.status(401).json({ error: 'Invalid Google login' });
    }
}

async function handleUserLogout(req, res) {
    const token = req.cookies.refreshToken;
    if (token) {
        await RefreshToken.deleteOne({ token });
    }
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
    });
    res.sendStatus(204);
}

module.exports = {
    handleUserSignUp,
    handleUserLogin,
    handleGoogleLogin,
    handleUserLogout,
};
