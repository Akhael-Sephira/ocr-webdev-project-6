const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const { authorization } =  req.headers;
        if (!authorization) return res.sendStatus(401);
        const token = authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        }
        next();
    } catch(error) {
        res.sendStatus(401);
    }
}