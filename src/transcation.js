/**
 * @module Transcation used for creating and verifying transcations
 */

import { KeyPair } from './utils/cryptoUtils';

/**
 * @class Transcation
 */
export class Transcation {
    constructor(fromAddress, toAddress, amount, fee) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.fee = fee;
        this.amount = amount;
    }

    /**
     * Signs a transcation with a given keypair
     * @param {KeyPair} keyPair 
     */
    sign(keyPair) {
        const data = JSON.stringify(this);
        const signature = keyPair.sign(data);
        this.signature = signature;
    }   

    verify(publicKey) {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify(this);
            KeyPair.verifySignature(publicKey, data)
            .then((isVerified) => {
                resolve(isVerified)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }
}