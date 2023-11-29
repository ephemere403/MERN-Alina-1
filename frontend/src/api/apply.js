import axios from "axios";

export const fetchApply = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/apply`, {
            withCredentials: true
        });
        return response
    } catch (error) {
        return { error };
    }
};

export const patchApply = async (data) => {
    try {
        const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/apply/update`, data ,{
            withCredentials: true
        });
        return response
    } catch (error) {
        return { error };
    }
};

export const postApply = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/apply/post`, data ,{
            withCredentials: true
        });
        return response
    } catch (error) {
        return { error };
    }
};