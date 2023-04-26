/**
 * User Model
 */
import { Schema, model, models} from 'mongoose';

const userSchema =  new Schema({
    /** 
     * The username of the user
     */
    username: {
        type: String,
        required: true
    },
    /** The Bcrypt hash of the user's password */
    password_hash: {
        type: String,
        required: true
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

const User = models.User || model('User', userSchema)