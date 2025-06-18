const fs = require('fs');
const path = require('path');

function logFileMiddleware() {
    return function (req, res, next) {
        const method = req.method;
        const logMessage = `${Date.now()}: ${method} ${req.url}\n`;
        const logPath = path.join(__dirname, '../logs/log.txt');

        fs.appendFile(logPath, logMessage, (err) => {
            if (err) {
                console.error('Logging error:', err);
            }
            next();
        });
    };
}

module.exports = logFileMiddleware;
