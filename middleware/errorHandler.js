const notFound = (req, res, next) => {
    const error = new Error(`Not found- ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const respErrorHandler = (err, req, res, _next) => {
    const statusCode =
        res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message || 'Something went wrong',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

module.exports = respErrorHandler;

module.exports = { notFound, respErrorHandler };
