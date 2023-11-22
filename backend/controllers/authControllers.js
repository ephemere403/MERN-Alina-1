import {UserModel} from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {sendEmail} from "../utils/mailer.js";
import {ClientError} from "../middleware/errorHandler.js";


export const registerUser = async (req, res, next) => {
    try {
        const {username, password, email} = req.body;

        let existingUser = await UserModel.findOne({email});
        if (existingUser) {
            throw new ClientError(`Email sending failed ${error.message}`, 'general');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const user = await new UserModel({
            username,
            password: hashedPassword,
            email,
            isEmailVerified: false
        });

        const token = jwt.sign({
                _id: user._id,
            },
            process.env.SECRET_TWO,
            {expiresIn: '1d'})
        const url = process.env.FRONTEND_URL + '/verify?' + token
        try {
            await sendEmail(user.email, 'Verifying your email', 'Verification', {
                username: user.username,
                messageBody: `Thank you for joining our platform. Join us with this link to verify your email: ${url}`
            });
        } catch (error) {
            throw new ClientError(`Email sending failed ${error.message}`, 'general');
        }

        await user.save();

        res.json('user added, check your email')
    } catch (error) {
        next(error)
    }
}


export const loginUser = async (req, res, next) => {
    try {
        const {password, email} = req.body;

        let existingUser = await UserModel.findOne({email});
        if (!existingUser) {
            throw new ClientError(`User not found`, 'general');
        }

        if (!existingUser.isEmailVerified) {
            throw new ClientError(`Email is not verified, check mailbox`, 'general');
        }

        const isValidPass = await bcrypt.compare(password, existingUser.password);
        if (!isValidPass) {
            throw new ClientError('Password is incorrect', 'password');
        }
        ;

        const token = jwt.sign({
                user: {
                    _id: existingUser._id,
                    role: existingUser.role
                }
            },
            process.env.SECRET_ONE,
            {expiresIn: '15m'})

        res.json({username: existingUser.username, token: token});
        console.log('say hi')
    } catch (error) {
        next(error)
    }
}

export const verifyUser = async (req, res, next) => {
    try {
        const email_token = req.query.token
        const decoded = jwt.verify(email_token, process.env.SECRET_TWO)
        const user = await UserModel.findByIdAndUpdate(decoded._id, {isEmailVerified: true})

        const token = jwt.sign({
                user: {
                    _id: user._id,
                    role: user.role
                }
            },
            process.env.SECRET_ONE,
            {expiresIn: '15m'})
        res.json(`now your account is all good! ${token}`)

    } catch (error) {
        next(error)
    }
}

export const resendMail = async (req, res, next) => {
    try {
        const {email} = req.body;
        let existingUser = await UserModel.findOne({email});
        if (!existingUser) {
            throw new ClientError(`No such user has been found :(`, 'general');
        }
        const token = jwt.sign({
                _id: user._id,
            },
            process.env.SECRET_TWO,
            {expiresIn: '12h'})
        const url = process.env.FRONTEND_URL + '/verify?' + token
        try {
            await sendEmail(user.email, 'Verifying your email', 'Verification', {
                username: user.username,
                messageBody: `Thank you for joining our platform. Join us with this link to verify your email: ${url}`
            });
        } catch (error) {
            throw new ClientError(`Email sending failed ${error.message}`, 'general');
        }
    } catch (error) {
        next(error)
    }
}