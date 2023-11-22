export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    if (error.errors && Array.isArray(error.errors)) {
        const formattedErrors = error.errors.map(e => ({
            message: e.msg, param: e.param || e.path
        }));
        return res.status(statusCode).json({errors: formattedErrors});
    }
    console.log('not good')
    console.log(statusCode)
    return res.status(statusCode).json({message: error.message})
}