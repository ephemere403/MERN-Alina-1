import {UserModel} from "../model/UserModel.js";

export const getProfile = async (req, res, next) => {
    try {
        let meUser = await UserModel.findById(req.user._id);
        if(!meUser){
            return res.json('user is not existing')
        }
        res.json(meUser.username)
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
            return res.json('no data to update')
        }

        let user = await UserModel.findById(req.user._id);
        if(!user){
            return res.json('user is not existing')
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