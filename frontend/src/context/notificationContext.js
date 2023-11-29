import React, { createContext, useState, useContext } from 'react';

export const NotificationContext = createContext({
    notifications: [],
    setNotifications: () => {},
    clearNotifications: () => {}
});

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const clearNotifications = (param) => {
        if (param) {
            setNotifications(notifications.filter());
        } else {
            setNotifications([]);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useError = () => useContext(NotificationContext);
