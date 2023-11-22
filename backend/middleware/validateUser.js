import {body, validationResult} from "express-validator";

export const userValidateRegister = [
    body('username').notEmpty().withMessage('Username cannot be empty'),
    body('email').notEmpty().withMessage('Email cannot be empty').bail().isEmail().withMessage('You need email to verify'),
    body('password').notEmpty().withMessage('Password cannot be empty').bail().isStrongPassword({minLength: 6}).withMessage('Your password needs to be 6 characters, including capital and lowercase letters, symbol, and number'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(errors)
        }

        next();
    }
]

// не нашел ответа в интернете как реализовать валидацию лучше
// chatgpt предложил параметризовать validateRegister(boolean) и выдавать метод на if
// code-smells


export const userValidateUpdate = [
    body('username').optional(true).notEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('You need email to verify'),
    body('password').optional().isStrongPassword({minLength: 6}).withMessage('Your password needs to be 6 characters, including capital and lowercase letters, symbol, and number'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(errors)
        }

        next();
    }
]