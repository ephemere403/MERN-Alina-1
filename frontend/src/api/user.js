import axios from "axios";

export const updateUser = async (data) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/update`, data, {
        withCredentials: true
    });
    return response;
};


export const fetchUserData = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/get`, {
        withCredentials: true
    });
    const email = response.data.email
    const username = response.data.username
    const role = response.data.role
    return {email, username, role};
};

export const fetchClientData = async (data) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/login`, data, {
        withCredentials: true
    });
    const [username, email] = response.data.split(' ');
    return {username, email};
};

export const fetchManagerData = async (data) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/login`, data, {
        withCredentials: true
    });
    const [username, email] = response.data.split(' ');
    return {username, email};
};