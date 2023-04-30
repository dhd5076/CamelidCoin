/**
 * @module CryptoUtils Provides utilities for handling crypto functions
 * **/
const crypto = require('crypto')
const bs58check = require('bs58check');

/**
 * Used for storing a key pair
 * @class KeyPair
 */
class KeyPair {
    
    /**
     * Initialize KeyPair
     */
    init() {
        return new Promise((resolve, reject) => {
            this.generateAddress().then(resolve).catch(reject)
        })
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
            this.privateKey = privateKey.export({type: 'pkcs8', format: 'der'});
            this.publicKey = publicKey.export({type: 'spki', format: 'der'});
        })
    }

    /**
     * Generates an encoded address from the wallet's public key
     * @returns 
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
     */
    generatePOWHash() {
        return new Promise((resolve, reject) => {
            
        })
    }
}

async function a() {
    const b = new KeyPair();
    await b.init();
    console.log(b)
}

a();

module.exports = {
    KeyPair
}