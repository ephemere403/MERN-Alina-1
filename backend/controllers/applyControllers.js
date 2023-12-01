import {ApplyModel} from "../model/ApplyModel.js";
import {UserModel} from "../model/UserModel.js";
import {sendEmail} from "../utils/mailer.js";
import {ClientError} from "../middleware/errorHandler.js";
import { io } from '../index.js';



export const getAllApplies = async (req, res, next) => {
    try {
        const username = req.query.username
        const currentPage = parseInt(req.query.currentPage, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 10;
        if (req.user?.role === 'client') {
            const myApplies = await ApplyModel
                .find({createdBy: req.user._id})
                .skip(currentPage * limit)
                .limit(limit)

            res.json(myApplies)
        }
        else {
            const openApplies = await ApplyModel
                .find({status: 'open'})
                // .populate({
                //     path: 'createdBy',
                //     select: 'username -_id'
                // })
                // .skip(currentPage * limit)
                // .limit(limit);
            res.json(openApplies)
        }
        io.to(username).emit('hello', 'whats-up')


    } catch (error) {
        next(error)
    }
}


export const getApply = async (req, res, next) => {
    try {
        const applyId = req.query.id
        const apply = await ApplyModel.findById(applyId);
        if (!apply) {
            throw new ClientError(`Apply not found`, 'general');
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            throw new ClientError(`Not authorized`, 'auth');
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
        io.to('managers').emit('newApply', {applyId: apply._id})
        res.json({message: 'application saved successfully', id: apply._id});

    } catch (error) {
        next(error)
    }
}

export const updateApply = async (req, res, next) => {
    try {
        const applyId = req.query.id
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
            apply.status = 'open'
            apply.managedBy = 'none'
        } else if (req.user.role === 'manager') {
            apply.status = status || apply.status;
            apply.managedBy = req.user._id
            let user = await UserModel.findById(req.user._id)
            if (apply.isModified('status')) {
                try {
                    await sendEmail(user.email, `Apply ${apply.title} status`, 'Notification', {
                        username: user.username,
                        messageBody: `status of your apply set ${apply.status.toString()} `
                    });
                    io.to(apply.createdBy.username).emit('hello', {applyId: apply._id})
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
        const applyId = req.query.id
        const apply = await ApplyModel.findById(applyId);
        if (!apply) {
            throw new ClientError(`Apply not found`, 'general');
        }

        if (req.user.role === 'client' && apply.createdBy.toString() !== req.user._id.toString()) {
            throw new ClientError(`Not authorized`, 'general');
        }

        await ApplyModel.findByIdAndDelete(applyId);
        res.json({message: 'application deleted successfully'})

    } catch (error) {
        next(error)
    }
}