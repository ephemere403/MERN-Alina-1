import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be empty']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty'],
        minLength: [6, 'Password should be minimum 6 characters']
    },
    email: {
        type: String,
        required: [true, 'You need email to verify'],
        unique: true
    },
    isEmailVerified: { // на email приходит токен для подтверждения почты
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: {
            values: ['client', 'manager'],
            message: `{VALUE} is not defined role`
        },
        default: 'client'
    }

})

export const UserModel = mongoose.model('User', userSchema);

