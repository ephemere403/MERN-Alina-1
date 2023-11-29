import axios from 'axios';

export const loginUser = async (data) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, data);
    const username = response.data.username
    const role = response.data.role
    return {username, role};
};


export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register`, data);
        return response
    } catch (error) {
        return {error};
    }
};

export const whereIsTheCookie = async () => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/token`, {}, {
        withCredentials: true
    });
    return response;
};