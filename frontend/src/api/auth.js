import axios from 'axios';

export const loginUser = async (data) => {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, data);
        const [username, token] = response.data.split(' ');
        return {username, token};
};



export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, data);
        return {data};
    } catch (error) {
        throw error
    }
};
