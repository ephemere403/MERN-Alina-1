import {ApplyModel} from "../model/ApplyModel.js";

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

    socket.on('return', async ({message}) => {
        console.log(message)
        const notificationData = await getRandom();
        socket.emit('notification', notificationData)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});}

const getRandom = async () => {
    const randomArray = await ApplyModel.aggregate([
        { $sample: { size: 1 } }
    ]);
    let randomApplyId = randomArray[0]._id.toString()
    return  { applyId: randomApplyId}
}