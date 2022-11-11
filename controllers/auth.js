const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    if (!User.isPasswordValid(req.body.password)) return res.status(400).json({ error: "Password must have at least eight characters, at least one upper case English letter, one lower case English letter, one number and one special character" });
    const user = new User({...req.body});
    user.save()
    .then(() => { res.status(201).json({ message: "User created!" })})
    .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
    User.getAuthenticated(req.body.email, req.body.password)
    .then(user => {
        res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                config.app.secret,
                { expiresIn: 60 * 60 }
            )
        })
    })
    .catch(error => res.status(500).json({ error }));
};