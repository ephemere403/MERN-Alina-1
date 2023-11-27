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
        return {data};
    } catch (error) {
        throw error
    }
};

export const whereIsTheCookie = async () => {
    const data = ''
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/token`, data, {
        withCredentials: true
    });
    return response;
};