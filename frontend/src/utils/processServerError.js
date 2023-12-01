export const processServerError = (error) => {
    if (error.response && error.response.data) {
        if (Array.isArray(error.response.data)) {
            // if array
            return error.response.data;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
            return error.response.data.errors;
        } else {
            // wrap array
            return [error.response.data];
        }
    } else {
        return [{"message": error.message, "param": 'general'}];
    }
};
