import {body, validationResult} from "express-validator";

export const applyValidatePost = [
    body('title').notEmpty().withMessage('Please fill the title').bail().isLength({min:3, max: 24}).withMessage('Title is 3-24 characters'),
    body('amount').notEmpty().withMessage('Please fill the amount').bail().isNumeric().withMessage('Amount should be numeric'),
    body('date').notEmpty().withMessage('Please select the date').bail().isISO8601().toDate(),
    body('description').optional().isLength({max: 140}).withMessage('Description is no more than 140 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(errors)
        }

        next();
    }
]

export const applyValidateUpdate = [
    body('title').optional().notEmpty().withMessage('Please fill the title').bail().isLength({min:3, max: 24}).withMessage('Title is 3-24 characters'),
    body('amount').optional().notEmpty().withMessage('Please fill the amount').bail().isNumeric().withMessage('Amount should be numeric'),
    body('date').optional().notEmpty().withMessage('Please select the date').bail().isISO8601().toDate(),
    body('description').optional().isLength({max: 140}).withMessage('Description is no more than 140 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(errors)
        }

        next();
    }
]