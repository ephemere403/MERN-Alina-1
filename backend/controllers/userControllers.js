import {UserModel} from "../model/UserModel.js";
import {ClientError} from "../middleware/errorHandler.js";
import {ApplyModel} from "../model/ApplyModel.js";

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

export const getManagerDashboard = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.currentPage, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 10;

        if (isNaN(currentPage) || isNaN(limit)) {
            return res.status(400).json({ message: "Invalid query parameters", param: 'data'});
        }

        if (req.user.role !== 'manager') {
            return res.status(403).json({message: "Unauthorized"});
        }

        const openApplies = await ApplyModel.aggregate([
            { $match: { managedBy: req.user._id } }, // Match applies where managedBy equals the user's ID
            { $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }},
            { $unwind: '$createdBy' }, // Deconstructs the createdBy array field
            { $group: {
                    _id: { date: "$date", status: "$status", username: "$createdBy.username" },
                    count: { $sum: 1 }
                }},
            { $sort: { '_id.date': 1 } } // Sort by date
        ])
            .skip(currentPage * limit)
            .limit(limit);

        res.json(openApplies);

    } catch (error) {
        next(error)
    }
}

export const getClientDashboard = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.currentPage, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 10;

        if (isNaN(currentPage) || isNaN(limit)) {
            return res.status(400).json({ message: "Invalid query parameters", param: 'data'});
        }

        if (req.user.role !== 'client') {
            return res.status(403).json({message: "Unauthorized"});
        }

        const userApplies = await ApplyModel.aggregate([
            { $match: { status: 'open' } },
            { $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }},
            { $unwind: '$createdBy' }, //deconstructs the createdBy array field from the joined document to enable grouping by username.
            { $group: {
                    _id: { date: "$date", status: "$status", username: "$createdBy.username" },
                    count: { $sum: 1 }
                }},
            { $sort: { '_id.date': 1 } } // sort by date
        ])
            .skip(currentPage * limit)
            .limit(limit);

        res.json(userApplies);
    } catch (error) {
        next(error);
    }
};