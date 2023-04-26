/**
 * @class User
 */
import { Schema, model, models} from 'mongoose';

const userSchema =  new Schema({
    /** 
     * The username of the user
     */
    username: {
        type: String,
        required: [true, "Username required"]
    },
    /** 
     * The Bcrypt hash of the user's password 
     */
    password_hash: {
        type: String,
        required: [true, "Password required"]
    },
    /** 
     * A list of active API key hashes created by the user, one is created by default at creation
     */
    api_keys: {
        type: [String],
        required: [true, "At least one API key is needed"]
    },
    /**
     * The coin balance of the user
     */
    balance: {
        type: Number,
        default: 0
    },
    /**
     * The calculated reputation of the user used for sifting out malicious actors
     */
    reputation: {
        type: Number,
        defualt: 100
    }

});

/**
 * Called whenever password property is modified.
 * Hashes password with bcrypt and saves it in place of the password.
 */
userSchema.pre('save', function(next) {
    var user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(4, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

/**
 * Used for checking if a supplied password matches the users password.
 * @param {String} candidatePassword The password that is being checked
 * @param {compareCallback} cb The function to handle results
 * 
 * @callback compareCallback
 * @param {Error} err Empty unless an error occurred comparing password
 * @param {Boolean} isMatch whether or no the candidate password matches
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const User = models.User || model('User', userSchema)

export default User