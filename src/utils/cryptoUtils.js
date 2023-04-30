/**
 * @module CryptoUtils Provides utilities for handling crypto functions
 * **/
const crypto = require('crypto')

/**
 * Used for storing a key pair
 * @class KeyPair
 */
class KeyPair {
    /**
     * Creates a new KeyPair object, optionally with existing key pairs
     * @param {PublicKey} publicKey the private key to use
     * @param {PrivateKey} privateKey the public key to use
     */
    constructor(publicKey, privateKey) {
        if(publicKey != undefined && privateKey != undefined) {
            this.fromExistingPair(publicKey, privateKey)
                .catch((error) => {
                throw error;
            })
        } else {
            this.generateKeyPair()
                .catch((error) => {
                throw error;
            })
        }
    }

    /**
     * Load from already exist keypair
     * @param {KeyObject} publicKey existing public key
     * @param {KeyObject} privateKey existing private key
     * @returns {Promise}
     */
    fromExistingPair(publicKey, privateKey) {
        return new Promise((resolve, reject) => {
            //TODO: verification and rejection
            this.publicKey = publicKey;
            this.privateKey = privateKey;
            resolve();
        })
    }

    /**
     * Generates a new keypair
     * @returns {Promise}
     */
    generateKeyPair() {
        return new Promise(async (resolve, reject) => {
            const { privateKey, publicKey} = await crypto.generateKeyPairSync('ec', {
                namedCurve: 'secp256k1'
            });
            this.privateKey = privateKey;
            this.publicKey = publicKey;
        })
    }
}

module.exports = {
    KeyPair
}