/**
 * @module CryptoUtils Provides utilities for handling crypto functions
 * **/
const crypto = require('crypto')
const bs58check = require('bs58check');

/**
 * Used for storing a key pair
 * @class
 */
class KeyPair {


    /**
     * Check whether or not a signature is valid
     * @param message The message to verify
     * @param signature The signature to verify
     * @returns {Promise.<boolean>}
     */
    static verifySignature(message, signature) {
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * Load from already exist keypair
     * @param {KeyObject} publicKey existing public key
     * @param {KeyObject} privateKey existing private key
     * @returns {Promise.<null, Error>}
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
     * @returns {Promise.<null, Error>}
     */
    generateKeyPair() {
        return new Promise(async (resolve, reject) => {
            const { privateKey, publicKey} = await crypto.generateKeyPairSync('ec', {
                namedCurve: 'secp256k1'
            });
            this.privateKey = privateKey.export({type: 'pkcs8', format: 'der'});
            this.publicKey = publicKey.export({type: 'spki', format: 'der'});
            resolve();
        })
    }

    /**
     * Get 
     * @returns {Promise.<Number, Error>} Returns the public key if resolved
     */
    getPublicKey() {
        return new Promise((resolve, reject) => {
            if(this.privateKey != undefined) {
                resolve(this.publicKey)
            } else {
                reject(new Error("No key has been generated"))
            }
        });
    }

    /**
     * Get Private Key
     * @returns {Promise.<Key, Error>} Returns the private key if resolved
     */ 
    getPrivateKey() {
        return new Promise((resolve, reject) => {
            if(this.privateKey != undefined) {
                resolve(this.privateKey)
            } else {
                reject(new Error("No key has been generated"))
            }
        })
    }

    /**
     * Generates an encoded address from the wallet's public key
     * @returns {Promise.<null, Error>}
     */
    generateAddress() {
        return new Promise((resolve, reject) => {
            const sha256Hash = crypto.createHash('sha256').update(this.publicKey).digest();
            const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();
            const version = Buffer.from('00', 'hex')
            const hashedPublicKey = Buffer.concat([version, ripemd160Hash])
            const doubleHash = crypto.createHash('sha256').update(
                crypto.createHash('sha256').update(hashedPublicKey).digest()
            ).digest();

            const checksum = doubleHash.slice(0, 4);

            const rawAddress = Buffer.concat([hashedPublicKey, checksum]);
            resolve(bs58check.encode(rawAddress));
        })
    }

    /**
     * Proof of Work Hash
     * @returns {Promise.<null, Error>}
     */
    generateNonce() { 
        return new Promise((resolve, reject) => {
            var nonce = 0;
            var hash;
            while(true) {
                hash = crypto.createHash('sha256').update(this.publicKey + nonce.toString()).digest();
                if(hash.slice(0,3) == '000') {
                    console.log(nonce);
                    this.nonce = nonce;
                    resolve()
                }
                nonce++;
            }
        })
    }

    /**
     * Sign a message with private key
     * @param {String} message The message to sign
     * @returns {Promise.<string, Error>} Returns the generated signature if resolved
     */
    signMessage(message) {
        return new Promise((resolve, reject) => {
            const sign = crypto.createSign('SHA256').update(message).end();
            const signature = sign.sign(this.privateKey, 'base64')
            resolve(signature)
        });
    }
}

var a = new KeyPair()
a = 

module.exports = {
    KeyPair
}