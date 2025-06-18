const User = require('../models/users');
const { generateToken } = require('../services/tokenServices');

async function handleUserSignUp(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Missing required fields" });

        const userExists = await User.findOne({
            email,
        })

        if (userExists?.email) {
            //res.status(400)
            //throe new Error('Account already exists"')
            return res.status(400).json({ error: "Account already exists" });
        }
        const user = await User.create({
            email,
            password
        });

        if (user) {
            return res.status(201).send({
                id: user._id,
                email: user.email,

            })
        } else {
            return res.status(400).json({ error: "Error registering" });
        }
    } catch (err) {
        console.log(error);
        return res.status(500).json({ error: "Server Error" });
    }


}

async function handleUserLogin(req, res) {
    const { email, password } = req.body
    const user = await User.findOne({
        email,
    });
    if (user && (await user.matchPasswords(password))) {

        res.status(200).json({
            id: user._id,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({ error: "Invalid username or password" })
    }
}

module.exports = { handleUserSignUp, handleUserLogin };