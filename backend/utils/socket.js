export default function setupSocket (io) {
    io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', ({ username, role }) => {
        console.log({username, role})
        socket.join(username); // Using username as a room id
        if (role === 'manager') {
            socket.join('managers'); // Managers join a common room
        }
        socket.emit('update',1)
    });

    socket.on('return', ({data}) => {
        console.log(data)
        socket.emit('notification',1)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});}
