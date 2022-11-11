const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const SALT_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 60 * 1000;

const User = mongoose.Schema({
    email: { type: String, required: true, unique: true, match: emailReg },
    password: { type: String, required: true },

    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

User.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
}

/** Returns the login attempt's locked state of the user */
User.virtual('isLocked').get(function() {
    return this.lockUntil && this.lockUntil > Date.now();
});

/** Returns true if the given password is in a valid format */
User.statics.isPasswordValid = function(password) {
    return (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+\-=|\\]).{8,32}$/).test(password);
}

/** Hash the password before saving it to the db */
User.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

/** Increment the user's login attempts & lock it if reached the limit of allowed attempts */
User.methods.incLoginAttempts = async function() {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } });
    }
    let updates = { $inc: { loginAttempts: 1 }};
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return await this.updateOne(updates);
}

/** Compare the given password to the user's password */
User.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

/** Verify email & password, returns the associated user if successful */
User.statics.getAuthenticated = async function(email, password) {

    const user = await this.findOne({email: email})

    if (!user) throw { error: "Failed to Authenticate: " + this.failedLogin.NOT_FOUND };
    if (user.isLocked) throw { error: "Failed to Authenticate: " + this.failedLogin.MAX_ATTEMPTS };

    const validPW = await user.validatePassword(password);

    if(!validPW) {
        await user.incLoginAttempts();
        throw { error: "Failed to Authenticate: " + this.failedLogin.PASSWORD_INCORRECT };
    }
    if(user.loginAttempts != 0 || user.lockUntil) {
        await user.updateOne({
            $set: { loginAttempts: 0 },
            $unset: { lockUntil: 1 }
        });
    }
    return user;
}

User.plugin(uniqueValidator);

module.exports = mongoose.model('User', User);