export default function setupSocket (io) {
    io.on('connection', (socket) => {
    console.log('A user connected');


    socket.on('joinRoom', ({ username, role }) => {
        socket.join(username); // Using username as a room id
        if (role === 'manager') {
            socket.join('managers'); // Managers join a common room
        }
        socket.to(username).emit('hello', 'mom i made it')
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});}
