/**
 * Used for creating and managing wallet objects
 * @module Wallet
 * @author Dylan Dunn
 */
import 

/**
 * @class Wallet
 */
class Wallet {
    /**
     * Used for creating new wallet objects from a keypair
     * @param {KeyPair} keyPair Keypair to use to generate the wallet
     */
    constructor(keyPair) {
        this.keyPair = keyPair;
    }
}

exports = Wallet;