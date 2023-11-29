export default function setupSocket (io) {
    io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a room based on username
    socket.on('joinRoom', ({ username, isManager }) => {
        socket.join(username); // Using username as a room id

        if (isManager) {
            socket.join('managers'); // Managers join a common room
        }
    });

    // You can also handle other events here

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});}
