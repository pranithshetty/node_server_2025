require('dotenv').config();
const express = require("express");
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/userRoutes');
const logFileMiddleware = require("./middleware/logFileMiddleware");
const limiter = require("./middleware/rateLimiter");
const PORT = 8000;
const { connectMongoDb } = require('./services/mongoConnection');
const { notFound, respErrorHandler } = require('./middleware/errorHandler');
const { verifyToken } = require('./services/tokenServices');
// app.set("view engine", "ejs") //set view engine if serving from server
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static(path.join(__dirname, "public"))) to serve static files from pulic folder
app.use(cors({
    origin: 'http://localhost:5173',
    // credentials: true // If you're using cookies or authorization headers
}));

app.use(limiter);
app.use(logFileMiddleware())

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching users:', err);
        throw err;
    }
}
app.get('/all-users',verifyToken, async (req, res) => {
    try {
        const data = await getUsers();
        res.status(200).json({data, user: req.user});
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users' });
    }
})

app.use('/user', userRoutes)
app.use(notFound)
//app.use(respErrorHandler)


app.listen(PORT, async () => {
    console.log("running...port:", PORT); 
    await connectMongoDb(process.env.MONGO_ATLAS_URI);
})