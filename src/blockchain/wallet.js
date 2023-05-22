/**
 * Used for creating and managing wallet objects
 * @module Wallet
 * @author Dylan Dunn
 */
const { KeyPair } = require('../utils/cryptoUtils')

/**
 * @class Wallet
 * @classdesc Represents a wallet in the blockchain
 */
class Wallet {
    /**
     * @constructor
     * @description Creates a new wallet object
     * @param {KeyPair} keyPair Keypair to use to generate the wallet
     */
    constructor(keyPair) {
        this.keyPair = keyPair;
    }

    /**
     * @method init
     * @description Initializes the wallet using keypair
     * @returns {Promise.<null, Error>}
     */
    init() {
        return new Promise((resolve, reject) => {
            logger.debug("Initializing Wallet...")
            this.keyPair.generateAddress()
            .then((address) => {
                this.address = address;
                logger.debug("Address generated: " + address)
                logger.debug("Generating Nonce...")
            })
            .then(() => this.keyPair.generateNonce())
            .then(() => {
                logger.debug("Nonce Generated: " + this.keyPair.nonce)
                resolve()
            })
        })
    }
 }
exports = Wallet;