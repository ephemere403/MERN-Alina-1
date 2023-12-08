import React, {createContext, useState, useContext, useEffect} from 'react';
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        username: localStorage.getItem('username') || null,
        role: localStorage.getItem('role') ||null
    });

    useEffect(() => {
        localStorage.setItem('username', authState.username);
        localStorage.setItem('role', authState.role);
    }, [authState]);

    const setUser = (username, role) => {
        setAuthState({ username, role});
    };

    const clearUser =  async () => {
        setAuthState({ username: null, role: null});
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/profile/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <UserContext.Provider value={{ ...authState, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
