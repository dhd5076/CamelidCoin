/**
 * @module Transcation used for creating and verifying transcations
 * @author Dylan Dunn
 */

import { KeyPair } from '../utils/cryptoUtils.js';

/**
 * @class Transaction
 * @classdesc Represents a transaction in the blockchain
 */
export class Transaction {
    /**
     * @constructor
     * @description Creates a transaction
     * @param {String} fromAddress The address the transaction is from
     * @param {String} toAddress The address the transaction is to
     * @param {Number} amount The amount of the transaction
     * @param {Number} fee The fee of the transaction
     * @param {Date} timestamp The timestamp of the transaction
     * @param {String} validationScript The validation script of the transaction
     */
    constructor(fromAddress, toAddress, amount, fee, timestamp, validationScript) {
        this.type = type;
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.fee = fee;
        this.timestamp = timestamp;
        this.hash = this.calculateHash();
        this.validationScript = validationScript;
    }

    /**
     * @method calculateHash
     * @description Calculates the hash of the transaction
     * @returns {Promise.<String>} the hash of the transaction
     */
    calcaluteHash() {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.stringify({
                    type: this.type,
                    fromAddress: this.fromAddress,
                    toAddress: this.toAddress,
                    amount: this.amount,
                    fee: this.fee,
                    timestamp: this.timestamp,
                    validationScript: this.validationScript
                });
                const hash = crypto.createHash('sha256').update(data).digest('hex');
                resolve(hash)
            } catch(error) {
                reject(error)
            }
        })
    }

    /**
     * Signs a transaction with a given keypair
     * @method sign
     * @description Signs a transaction with a given keypair
     * @param {KeyPair} keyPair
     * @returns {Promise.<null>} 
     */
    sign(keyPair) {
        return new Promise((resolve, reject) => {
            keyPair.sign(this.hash)
            .then((signature) => {
                this.signature = signature;
                resolve();
            });
        })
    }

    /**
     * Determines if the transaction is valid
     * @method isValid
     * @description Determines if the transaction is valid
     * @returns {Promise.<Boolean>} whether or not the transaction is valid
     */
    validate() {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'));
        })
    }
}

/**
 * @class ValidationScript
 * @classdesc Represents a validation script for a transaction, //NOTE: may be redundant
 */
class ValidationScript {
    constructor() {

    }
}

/**
 * @class JobValidationScript
 * @classdesc transaction that depends on job completion for verification
 */
export class JobValidationScript extends ValidationScript {
    constructor() {
    }

    /**
     * @method isValid
     * @description Validates whether or not the script is valid
     * @returns {Promise.<Boolean>} whether or not the script is valid
     */
    isValid() {
        return new Promise((resolve, reject) => {
        });
    }
}

/**
 * @class PubKeyValidationScript
 * @classdesc transaction that depends on a public key for verification
 */
export class PubKeyValidationScript extends ValidationScript {
    constructor() {
    }

    /**
     * @method isValid
     * @description Validates whether or not the script is valid
     * @returns {Promise.<Boolean>} whether or not the script is valid
     */
    isValid() {
        return new Promise((resolve, reject) => {
        });
    }
}