/**
 * @module Transcation used for creating and verifying transcations
 */

import { KeyPair } from './utils/cryptoUtils';

/**
 * @class Transcation
 */
export class Transcation {
    constructor(inputs, outputs, timestamp) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.timestamp = timestamp;
        this.hash = this.calculateHash();
        this.signature = null;
    }

    /**
     * Create a new transcation
     * @param {Wallet} wallet wallet object to use to send from and sign the transaction
     * @param {*} output 
     */
    static create(wallet, ) {
        return new Promise((resolve, reject) => {
            return new Transcation(
                [],
                [],
                Date.now()
            )
        })
    }

    /**
     * Calculates the hash of the transcation
     */
    calcaluteHash() {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(this);
            const hash = crypto.createHash('sha256').update(data).digest('hex');
        })
    }

    /**
     * Signs a transcation with a given keypair
     * @param {KeyPair} keyPair
     * @returns {Promise.<null>} 
     */
    sign(keyPair) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(this);
            const signature = keyPair.sign(data);
            this.signature = signature;
            resolve();
        })
    }   

    verify(publicKey) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(this);
            KeyPair.verifySignature(publicKey, data)
            .then((isVerified) => {
                resolve(isVerified);
            })
            .catch((error) => {
                reject(error);
            })
        })
    }
}

export class Input {

}

export class Output {

}