import jwt from "jsonwebtoken";
import {ClientError} from "./errorHandler.js";

export const authVerify = (req, res, next) => {
    const token = req.cookies.token;
    //JWT будет храниться в HTTP-Only cookie
    if (!token) {
        const error = new ClientError('you should login first', 'general');
        error.code(401)
        return next(error);
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_ONE);
        // console.log(jwt.decode(token).exp)
        // console.log(Date.now()/1000)
        req.user = decoded.user;
        // user : {_id, role}
        next();
    } catch (err) {
        const error = new ClientError('token is not valid', 'token')
        error.code(401)
        next(error);
    }
};

export const refreshAuth = (req, res, next) => {
    const token = req.header('Authorization');
    // для большего удобства юзера можно создавать рефреш токен в cookies(http-only)
    // на фронте повесить скрипт then. catch(обновить access token по рефреш токену)
    // здесь выдавать access по рефрешу
}