import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        username: null
    });

    const setUser = (username, token) => {
        setAuthState({ username, token });
    };

    const clearUser = () => {
        setAuthState({ username: null, token: null });
    };

    return (
        <UserContext.Provider value={{ ...authState, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
