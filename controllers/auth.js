const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.signup = (req, res, next) => {
    const user = new User({...req.body});
    console.log(user);
    user.save()
    .then(() => { res.status(201).json({ message: "User created!" })})
    .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) return res.status(401).json({ message: "Incorrect credentials." });
        user.validatePassword(req.body.password)
        .then(valid => {
            if (!valid) return res.status(401).json({ message: "Incorrect credentials." });
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
    })
    .catch(error => res.status(500).json({ error }));
};