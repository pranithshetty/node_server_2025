const mongoose = require('mongoose');

async function connectMongoDb(url) {
    try {
        const connectionInstance = await mongoose.connect(`${url}`);
        console.log(
            `\nMongoDB connected !! DB HOST::${connectionInstance?.connection?.host}`
        );
    } catch (err) {
        console.err('Mongo ERR', err);
        process.exit(1);
    }
}

module.exports = { connectMongoDb };
