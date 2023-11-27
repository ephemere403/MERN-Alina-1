import React, { createContext, useState, useContext } from 'react';

export const ErrorContext = createContext({
    serverError: [],
    setServerError: () => {},
    clearError: () => {}
});

export const ErrorProvider = ({ children }) => {
    const [serverError, setServerError] = useState([]);

    const clearError = () => {
        setServerError([]);
    };

    return (
        <ErrorContext.Provider value={{ serverError, setServerError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);
