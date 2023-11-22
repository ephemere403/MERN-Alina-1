import axios from 'axios';

export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, data);
        const [username, token] = response.data.split(' ');
        return {username, token};
    } catch (error) {
        if (error.response) {
            // 400, 401, etc
            throw new Error(error.response.data);
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};



export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, data);
        return {data};
    } catch (error) {
        throw error
    }
};
