/**
 * @class User
 */
import { Schema, model, models} from 'mongoose';

const walletSchema =  new Schema({
    /** 
     * The address of the wallet
     */
    address: {
        type: String,
        required: [true, "Address required"]
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
    },
    /**
     * The public key of the wallet, used for secure communication and verifying digital signing
     */
    public_key: {
        type: String,
        required: [true, "Wallet must have public key"]
    }

});

const Wallet = models.User || model('Wallet', userSchema)

export default User