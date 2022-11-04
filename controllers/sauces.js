const Sauce = require('../models/sauce');

exports.get = (req, res, next) => { 
    Sauce.find()
    .then(results => {
        res.status(200).send(results);
    })
    .catch(error => res.status(400).json({error}));
}
exports.getOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(result => {   
        res.status(200).send(result);
    })
    .catch(error => res.status(400).json({error}));
}
exports.post = (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Bad request" }) 
    const sauce = new Sauce({ ...JSON.parse(req.body.sauce) });
    sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    sauce.userId = req.auth.userId;
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce created!" }))
    .catch(error => res.status(400).json({ error }));
}
exports.updateOne = (req, res, next) => {
    let data = {};
    if (!req.file) {
        data = { 
            ...req.body,
            _id: req.params.id,
        };
    } else {
        data = { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            _id: req.params.id,
        };
    }
    Sauce.updateOne({ _id: req.params.id }, data)
    .then(() => res.status(200).json({ message: "Sauce updated! "}))
    .catch(error => res.status(400).json({error}));
}
exports.deleteOne = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
    .then(() => {   
        res.status(200).json({ message: 'Sauce deleted!' });
    })
    .catch(error => res.status(400).json({error}));
}
exports.like = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        switch(req.body.like) {
            case -1: sauce.dislike(req.auth.userId);
                break;
            case 0: sauce.removeLikeAndDislike(req.auth.userId);
                break;
            case 1: sauce.like(req.auth.userId);
                break;
            default: return res.sendStatus(400); 
        }
        sauce.save()
        .then(() => res.status(200).json({ message: 'Sauce updated !' }))
        .catch(error => res.status(400).json({ error }));
    });
}
