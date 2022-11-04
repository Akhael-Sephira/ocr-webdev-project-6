const Sauce = require('../models/sauce');

exports.isOwner = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        if (sauce.isOwner(req.auth.userId)) return next();
        else return res.sendStatus(403);
    })
    .catch(error => res.status(400).json({ error }));

}