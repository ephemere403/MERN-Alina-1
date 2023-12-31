import express from 'express';
import mongoose from "mongoose";
import {Server} from 'socket.io';
import { createServer } from 'http';
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import {errorHandler} from "./middleware/errorHandler.js";
import {userValidateUpdate, userValidateRegister} from "./middleware/validateUser.js";
import {authVerify} from "./middleware/authentication.js";
import {registerUser, loginUser, verifyUser, resendMail} from "./controllers/authControllers.js";
import {
    getClientDashboard,
    getManagerDashboard,
    getProfile,
    logOut,
    returnToken,
    updateProfile
} from "./controllers/userControllers.js";
import {
    getApply,
    postApply,
    updateApply,
    deleteApply, getAllApplies
} from "./controllers/applyControllers.js";
import {applyValidatePost, applyValidateUpdate} from "./middleware/validateApply.js";
import setupSocket from "./utils/socket.js";


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`database connected to ${process.env.MONGO_URI}`))
    .catch(err => console.log(err))

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true
    }
});

setupSocket(io);
const port = process.env.PORT || 5000

server.listen(port, () => console.log(`server started on ${port}`));

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true
};

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())

app.post('/login', loginUser)
app.post('/register', userValidateRegister, registerUser)
app.post('/verify', verifyUser)
app.post('/resend', resendMail)

app.get('/profile/get', authVerify, getProfile)
app.post('/profile/logout', logOut)
app.patch('/profile/update', userValidateUpdate, authVerify, updateProfile)


app.post('/token', returnToken)

app.get('/manager/applies', authVerify, getManagerDashboard)
app.get('/client/applies', authVerify, getClientDashboard)

app.get('/all-applies', getAllApplies)
app.post('/apply/post', applyValidatePost, authVerify, postApply)
app.patch('/apply/update', applyValidateUpdate, authVerify, updateApply)
app.delete('/apply/delete', authVerify, deleteApply)
app.get('/apply', authVerify, getApply)

app.use(errorHandler)

//app.all('/', redirect)
export { io };