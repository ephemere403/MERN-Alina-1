export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    if (error instanceof ClientError) {
        return res.status(statusCode).json([{
            message: error.message,
            param: error.param || 'general'
        }]);
    } else if (error.errors && Array.isArray(error.errors)) {
        const formattedErrors = error.errors.map(e => ({
            message: e.msg, param: e.param || e.path
        }));
        return res.status(statusCode).json(formattedErrors);
    } else {
        return res.status(statusCode).json([{
            message: error.message,
            param: 'general'
        }]);
    }
}


export class ClientError extends Error {
    constructor(message, param, statusCode = 400) {
        super(message);
        this.param = param;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}