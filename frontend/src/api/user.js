import axios from "axios";

export const updateUser = async (data) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/update`, data, {
        withCredentials: true
    });
    return response;
};


export const whereIsTheCookie = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/token`, {
        withCredentials: true
    });
    console.log(response.data)
    return response;
};

export const fetchUserEmail = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/get`);
    const email = response.data.email
    return {email};
};

export const fetchClientData = async (data) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/login`, data);
    const [username, email] = response.data.split(' ');
    return {username, email};
};

export const fetchManagerData = async (data) => {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/login`, data);
    const [username, email] = response.data.split(' ');
    return {username, email};
};