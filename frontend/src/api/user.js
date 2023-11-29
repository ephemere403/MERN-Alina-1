import axios from "axios";

export const updateUser = async (data) => {
    try {
        const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/profile/update`, data, {
            withCredentials: true
        });
        return response;
    } catch (error) {
        return { error };
    }
};


export const fetchUserData = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/profile/get`, {
            withCredentials: true
        });
        const email = response.data.email
        const username = response.data.username
        const role = response.data.role
        return {email, username, role};
    } catch (error) {
        return { error };
    }
};

export const fetchClientData = async (currentPage, limit) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/client/applies`, {
            params: {currentPage, limit},
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return { error };
    }
};

export const fetchManagerData = async (currentPage, limit) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/manager/applies`, {
            params: {currentPage, limit},
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        return { error };
    }
};