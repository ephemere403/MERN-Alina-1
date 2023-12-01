import axios from "axios";

export const fetchAllApplies = async (limit, currentPage) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/all-applies`, {
            params: {limit, currentPage},
            withCredentials: true
        });
        return response
    } catch (error) {
        return {error}
    }
}


export const fetchApply = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/apply`, {
            params: {id},
            withCredentials: true
        });
        return response
    } catch (error) {
        return {error};
    }
};

export const patchApply = async (data, id) => {
    try {
        const response = await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/apply/update`, data, {
            params: {id},
            withCredentials: true
        });
        return response
    } catch (error) {
        return {error};
    }
};

export const postApply = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/apply/post`, data, {
            withCredentials: true
        });
        return response
    } catch (error) {
        return {error};
    }
};

export const deleteApply = async (id) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/apply/delete`, {
            params: {id},
            withCredentials: true
        });
        return response
    } catch (error) {
        return {error};
    }
};
