import React, {createContext, useState, useContext} from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        username: null,
        role: null
    });

    const setUser = (username, role) => {
        setAuthState({ username, role});
    };

    const clearUser = () => {
        setAuthState({ username: null, role: null});
    };

    return (
        <UserContext.Provider value={{ ...authState, setUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
