import express from 'express';
import mongoose from "mongoose";
import 'dotenv/config';
import {registerUser, loginUser, verifyUser} from "./controllers/authControllers.js";
import {errorHandler} from "./middleware/errorHandler.js";
import {userValidateUpdate, userValidateRegister} from "./middleware/validateUser.js";
import {authVerify} from "./middleware/authentication.js";
import {getProfile, updateProfile} from "./controllers/userControllers.js";
import {getAllApplies, getApply, postApply, updateApply, deleteApply} from "./controllers/applyControllers.js";
import {applyValidatePost, applyValidateUpdate} from "./middleware/validateApply.js";
import cors from "cors";

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`database connected to ${process.env.MONGO_URI}`))
    .catch(err => console.log(err))

const app = express()
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server started on ${port}`))

app.use(cors())
app.use(express.json())

app.post('/login', loginUser)
app.post('/register', userValidateRegister, registerUser)
app.post('/verify', verifyUser)

app.get('/profile/get', authVerify, getProfile)
app.patch('/profile/update', userValidateUpdate, authVerify, updateProfile)

app.get('/apply', authVerify ,getAllApplies)
app.get('/apply:id', authVerify ,getApply)
app.post('/apply/post', applyValidatePost,authVerify, postApply)
app.patch('/apply/update:id', applyValidateUpdate, authVerify, updateApply)
app.delete('apply/delete:id', authVerify, deleteApply)

app.use(errorHandler)

//app.all('/', redirect)