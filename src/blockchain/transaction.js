/**
 * @module Transcation used for creating and verifying transcations
 */

import { KeyPair } from '../utils/cryptoUtils';

/**
 * @class Transcation
 * @classdesc Represents a transcation in the blockchain
 */
export class Transcation {
    constructor(inputs, outputs) {
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
     * Calculates the hash of the transcation
     */
    calcaluteHash() {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.stringify(this);
                const hash = crypto.createHash('sha256').update(data).digest('hex');
                resolve(hash)
            } catch(error) {
                reject(error)
            }
        })
    }

    /**
     * Signs a transcation with a given keypair
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
     * Determines if the transcation is valid
     * @returns {Promise.<Boolean>} whether or not the transcation is valid
     */
    validate() {
        return new Promise((resolve, reject) => {
            resolve(new Error('Not implemented'));
        })
    }
}

/**
 * @class ValidationScript
 * @classdesc Represents a validation script for a transcation
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