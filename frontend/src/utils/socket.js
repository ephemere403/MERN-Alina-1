import io from 'socket.io-client';

let socket;

export const initiateSocketConnection = () => {
    socket = io(process.env.REACT_APP_BACKEND_URL);
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};
