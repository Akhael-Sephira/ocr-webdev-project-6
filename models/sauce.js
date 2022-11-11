const mongoose = require('mongoose');

const Sauce = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, default: "" },
    description: { type: String, default: "" },
    mainPepper: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    heat: { type: Number, default: 1, min: 1, max: 10 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number , default: 0},
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

/** Returns true if the user is the sauce's owner */
Sauce.methods.isOwner = function(userId) {
    return this.userId == userId;
}

/** Dislikes the sauce */
Sauce.methods.dislike = function(userId) {
    if (!userId || typeof userId !== 'string') return;
    if (this.usersLiked.find(uId => uId === userId)) return;
    if (this.usersDisliked.find(uId => uId === userId)) return;
    this.dislikes++;
    this.usersDisliked.push(userId);
}
/** Likes the sauce */
Sauce.methods.like = function(userId) {
    if (!userId || typeof userId !== 'string') return;
    if (this.usersLiked.find(uId => uId === userId)) return;
    if (this.usersDisliked.find(uId => uId === userId)) return;
    this.likes++;
    this.usersLiked.push(userId);
}
/** Removes any like or dislike from the user */
Sauce.methods.removeLikeAndDislike = function(userId) {
    const ulIndex = this.usersLiked.findIndex(uId => uId === userId)
    const udIndex = this.usersDisliked.findIndex(uId => uId === userId)
    if (ulIndex >= 0) {
        this.usersLiked.splice(ulIndex, 1);
        this.likes--;
    }
    if (udIndex >= 0) {
        this.usersDisliked.splice(ulIndex, 1);
        this.dislikes--;

    }
}

module.exports = mongoose.model('Sauce', Sauce);