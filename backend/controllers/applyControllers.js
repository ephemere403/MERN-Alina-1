import {ApplyModel} from "../model/ApplyModel.js";
import {UserModel} from "../model/UserModel.js";
import {sendEmail} from "../utils/mailer.js";
import {ClientError} from "../middleware/errorHandler.js";

export const getManagerApplies = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.currentPage, 10);
        const limit = parseInt(req.query.limit, 10);

        if (isNaN(currentPage) || isNaN(limit)) {
            return res.status(400).json({ message: "Invalid query parameters", param: 'data'});
        }

        if (req.user.role !== 'manager') {
            return res.status(403).json({message: "Unauthorized"});
        }

        const openApplies = await ApplyModel
            .find({status: 'open'})
            .populate({
                path: 'createdBy',
                select: 'username -_id'
            })
            .skip(currentPage * limit)
            .limit(limit);

        await ApplyModel.aggregate([
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

        res.json(openApplies);

    } catch (error) {
        next(error)
    }
}

export const getClientApplies = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.currentPage, 10);
        const limit = parseInt(req.query.limit, 10);

        if (isNaN(currentPage) || isNaN(limit)) {
            return res.status(400).json({ message: "Invalid query parameters", param: 'data'});
        }

        if (req.user.role !== 'client') {
            return res.status(403).json({message: "Unauthorized"});
        }

        const userApplies = await ApplyModel.aggregate([
            { $match: { createdBy: req.user._id } },
            { $group: {
                    _id: { date: "$date", status: "$status" },
                    count: { $sum: 1 }
                }}
        ]).skip(currentPage * limit).limit(limit);

        res.json(userApplies);
    } catch (error) {
        next(error);
    }
};


export const getApply = async (req, res, next) => {
    try {
        const applyId = req.params.id
        const apply = await ApplyModel.findById(applyId);
        if (!apply) {
            throw new ClientError(`Apply not found`, 'general');
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            throw new ClientError(`Not authorized`, 'general');
        }

        return res.json(apply)

    } catch (error) {
        next(error)
    }
}

export const postApply = async (req, res, next) => {
    try {
        const {title, amount, description, date} = req.body;

        const apply = await new ApplyModel({
            title,
            amount,
            description,
            date,
            status: "open",
            createdBy: req.user._id
        });

        await apply.save();
        res.json({message: 'application saved successfully'});

    } catch (error) {
        next(error)
    }
}

export const updateApply = async (req, res, next) => {
    try {
        const applyId = req.params.id
        const {title, amount, description, date, status} = req.body;
        const apply = await ApplyModel.findById(applyId);

        if (!apply) {
            throw new ClientError(`Apply not found`, 'general');
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            throw new ClientError(`Not authorized`, 'general');
        }

        if (req.user.role === 'client') {
            apply.title = title || apply.title;
            apply.amount = amount || apply.amount;
            apply.description = description || apply.description;
            apply.date = date || apply.date;
        } else if (req.user.role === 'manager') {
            apply.status = status || apply.status;
            let user = await UserModel.findById(req.user._id)
            if (apply.isModified('status')) {
                try {
                    await sendEmail(user.email, `Apply ${apply.title} status`, 'Notification', {
                        username: user.username,
                        messageBody: `status of your apply set ${apply.status.toString()} `
                    });
                } catch (error) {
                    throw new ClientError(`Email sending failed ${error.message}`, 'general');
                }
            }
        }

        await apply.save();
        res.json({message: 'application updated successfully'});

    } catch (error) {
        next(error)
    }
}

export const deleteApply = async (req, res, next) => {
    try {
        const applyId = req.params.id
        const apply = await ApplyModel.findById(applyId);
        if (!apply) {
            throw new ClientError(`Apply not found`, 'general');
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            throw new ClientError(`Not authorized`, 'general');
        }

        await apply.remove()
        res.json({message: 'application deleted successfully'})

    } catch (error) {
        next(error)
    }
}