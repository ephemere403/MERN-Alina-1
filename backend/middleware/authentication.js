import jwt from "jsonwebtoken";

export const authVerify = (req, res, next) => {
    let authHeader = req.header('Authorization')
    //JWT будет храниться в header HTTP запроса
    if (!authHeader) {
        res.status(401);
        const error = new Error('you should login first');
        return next(error);
    }
    const token = authHeader.replace(/Bearer\s?/, '');;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_ONE);
        // console.log(jwt.decode(token).exp)
        // console.log(Date.now()/1000)
        req.user = decoded.user;
        // user : {_id, role}
        next();
    } catch (err) {
        res.status(401);
        console.log(token)
        next(new Error('token is not valid'));
    }
};

export const refreshAuth = (req, res, next) => {
    const token = req.header('Authorization');
    // для большего удобства юзера можно создавать рефреш токен в cookies(http-only)
    // на фронте повесить скрипт then. catch(обновить access token по рефреш токену)
    // здесь выдавать access по рефрешу
}