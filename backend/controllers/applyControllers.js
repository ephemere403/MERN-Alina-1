import {ApplyModel} from "../model/ApplyModel.js";
import {UserModel} from "../model/UserModel.js";
import {sendEmail} from "../utils/mailer.js";

export const getAllApplies = async (req, res, next) => {
    try {
        if (req.user.role === 'client') {
            const userApplies = await ApplyModel.find({createdBy: req.user._id});
            res.json(userApplies);
        } else if (req.user.role === 'manager') {
            const openApplies = await ApplyModel.find({status: 'open'}).populate({
                path: 'createdBy',
                select: 'username -_id'
            });
            res.json(openApplies);
        }
    } catch (error) {
        next(error)
    }
}

export const getApply = async (req, res, next) => {
    try {
        const applyId = req.params.id
        const apply = await ApplyModel.findById(applyId);
        if (!apply) {
            return res.status(404).json({message: 'apply not found'});
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "not authorized"});
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
            return res.status(404).json({message: 'application not found'});
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "not authorized"});
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
                    throw new Error(`Email sending failed: ${error.message}`)
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
            return res.status(404).json({message: 'apply not found'});
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({message: "not authorized"});
        }

        await apply.remove()
        res.json({message: 'application deleted successfully'})

    } catch (error) {
        next(error)
    }
}