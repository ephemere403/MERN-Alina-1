import express from 'express';
import mongoose from "mongoose";
import 'dotenv/config';
import {registerUser, loginUser, verifyUser, resendMail} from "./controllers/authControllers.js";
import {errorHandler} from "./middleware/errorHandler.js";
import {userValidateUpdate, userValidateRegister} from "./middleware/validateUser.js";
import {authVerify} from "./middleware/authentication.js";
import {getProfile, returnToken, updateProfile} from "./controllers/userControllers.js";
import {
    getApply,
    postApply,
    updateApply,
    deleteApply,
    getManagerApplies,
    getClientApplies
} from "./controllers/applyControllers.js";
import {applyValidatePost, applyValidateUpdate} from "./middleware/validateApply.js";
import cors from "cors";
import cookieParser from "cookie-parser";

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`database connected to ${process.env.MONGO_URI}`))
    .catch(err => console.log(err))

const app = express()
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server started on ${port}`))

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
app.patch('/profile/update', userValidateUpdate, authVerify, updateProfile)

app.get('/manager/apply', authVerify ,getManagerApplies)

app.get('/token', returnToken)

app.get('/applies', authVerify, getClientApplies)
app.get('/apply:id', authVerify ,getApply)
app.post('/apply/post', applyValidatePost,authVerify, postApply)
app.patch('/apply/update:id', applyValidateUpdate, authVerify, updateApply)
app.delete('apply/delete:id', authVerify, deleteApply)

app.use(errorHandler)

//app.all('/', redirect)