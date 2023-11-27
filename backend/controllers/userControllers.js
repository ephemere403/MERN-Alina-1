import {UserModel} from "../model/UserModel.js";
import {ClientError} from "../middleware/errorHandler.js";

export const getProfile = async (req, res, next) => {
    try {
        let meUser = await UserModel.findById(req.user._id);
        if(!meUser){
            throw new ClientError(`User not found`, 'general');
        }
        res.status(200).json({username: meUser.username, role: meUser.role, email: meUser.email});
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const {username, email} = req.body
        const userFields = {};
        if (username) userFields.username = username;
        if (email) userFields.email = email;

        // https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/
        // console.log(JSON.stringify(userFields));
        // https://lodash.com/
        // _.isEmpty(userFields)

        if(JSON.stringify(userFields) === "{}") {
            throw new ClientError(`Fill any data`, 'username');
            throw new ClientError(`Fill any data`, 'email');
        }

        let user = await UserModel.findById(req.user._id);
        if(!user){
            throw new ClientError(`User not found`, 'general');
        }

        user = await UserModel.findByIdAndUpdate(
            req.user._id,
            {$set: userFields},
            {new: true}
        );

        res.json(user);
    } catch (error) {
        next(error)
    }
}

export const getClientDashboard = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};

export const getManagerDashboard = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};

export const logOut = async (req, res, next) => {
    try{
        res.cookie('token', '', {httpOnly: true, secure: false, sameSite: "Lax", path: '/', maxAge: 0})
            .cookie('hello', '',  {httpOnly: true, secure: false, sameSite: "Lax", path: '/', maxAge: 0})
            .status(200)
    } catch (error) {
        next(error);
    }
}

export const returnToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.token
        const hello = req.cookies.hello || ''
        if (token || hello) {
            res.json({ token, hello });
        } else {
            res.status(401).json({ message: "No token found" });
        }
    } catch (error) {
        next(error);
    }
};
