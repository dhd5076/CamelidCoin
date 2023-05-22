/**
 * @module Block used for handling blocks
 * @author Dylan Dunn
 */

import { Transaction } from './transaction.js';

/**
 * @class Block
 * @classdesc Represents a block in the blockchain
 */
export class Block {
    /**
     * @constructor
     * @param {Number} index The height of the block in the chain
     * @param {String} previousHash The hash of the previous block
     * @param {Date} timestamp The timestamp of the block
     * @param {Transaction[]} transactions The transactions in the block
     * @param {String} nonce The nonce of the block
     */
    constructor(index, previousHash, timestamp, transactions, nonce) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = nonce;
        //this.merkleRoot implement later on to allow lightweight nodes
        this.hash = calculateHash();
    }

    /**
     * @method createMerkleProof
     * @description Creates a merkle proof for a given transaction
     * @param {String} id the id of the transaction
     * @returns {Promise.<null, Error>}
     */
    getMerkleProof(id) {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'));
        });
    }

    /**
     * @method calculateMerkleRoot
     * @description Calculates the merkle root of the block
     * @returns {Promise.<String, Error>} the merkle root of the block
     */
    calculateMerkleRoot() {
        return new Promise((resolve, reject) => {
            reject(new Error('Not implemented'));
        });
    }

    /**
     * @method validate
     * @description Validates the block
     * @returns {Promise.<null, Error>}
     */
    validate() {
        return new Promise((resolve, reject) => {
            reject(new  Error('Not implemented'));
        });
    }

    /**
     * @method calculateHash
     * @description Calculates the hash of the block
     * @returns {Promise.<null, Error>}
     * @todo Implement this
     */
    calculateHash() {
        return new Promise((resolve, reject) => {
            const hash = SHA256(
                this.index +
                  this.previousHash +
                  this.timestamp +
                  JSON.stringify(this.transactions)
              ).toString();
              resolve(hash);
        })
    }
}