/**
 * Used for creating and managing wallet objects
 * @module Wallet
 * @author Dylan Dunn
 */
const { KeyPair } = require('./utils/cryptoUtils')

/**
 * @class Wallet
 */
class Wallet {
    /**
     * Used for creating new wallet objects from a keypair
     * @param {KeyPair} keyPair Keypair to use to generate the wallet
     */
    constructor(keyPair) {
        console.log("New Wallet Created")
        this.keyPair = keyPair;
    }

    /**
     * Initializes the wallet using keypair
     */
    init() {
        return new Promise((resolve, reject) => {
            console.log("Initializing Wallet...")
            this.keyPair.generateAddress()
            .then((address) => {
                this.address = address;
                console.log("Address generated: " + address)
                console.log("Generating Nonce...")
            })
            .then(() => this.keyPair.generateNonce())
            .then(() => {
                console.log("Nonce Generated: " + this.keyPair.nonce)
                resolve()
            })
        })
    }

    /**
     * Get keypair
     * @returns {Promise.<KeyPair>} keypair of this wallet
     */
    getKeyPair() {
        return new Promise((resolve, reject) => {
            resolve(this.keyPair)
        })
    }
 }

exports = Wallet;