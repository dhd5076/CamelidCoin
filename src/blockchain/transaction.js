/**
 * @module Transcation used for creating and verifying transcations
 */

import { KeyPair } from '../utils/cryptoUtils';

/**
 * @class Transcation
 */
export class Transcation {
    constructor(inputs, outputs, timestamp) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.type = 
        this.timestamp = timestamp;
        this.hash = this.calculateHash();
        this.signature = null;
    }

    /**
     * Enum representing the different types of transactions
     * @readonly 
     * @enum {Number}
     */
    static get Type() {
        return { 
            /**
             * Transaction type: wallet to wallet transfer.
             * Cannot be invalidated if valid while in pool
             */
            WALLET_TO_WALLET: 1,
            /**
             * Transaction type: payment by client to compute node
             * Can be invalidated by INVALID_OUTPUT or NO_OUTPUT
             */
            PAYMENT_FOR_JOB: 2,
            /**
             * Transaction: 
             */
            JOB_VOUCH: 3
        }
    }

    /**
     * Create a new WALLET_TO_WALLET transaction
     * @param {Wallet} wallet wallet object to use to send from and sign the transaction
     * @param {String} output wallet address of the destination of the transaction
     */
    static create_W2W_Transaction(wallet, ) {
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