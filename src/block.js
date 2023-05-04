/**
 * @module Block used for handling blocks
 */

import {Transaction} from './transaction';

class Block {
    constructor(transcations, previousHash) {
        //Merkle root, when brain isnt tired
        this.timestamp = new Date();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = "";
        this.nonce = 0;
    }

    /**
     * Initialize the block, not done with contructor because init is not instant.
     */
    init() {
        return new Promise((resolve, reject) => {
            this.hash = calculateHash();
            resolve();
        })
    }

    /**
     * Calculate the hash of the block
     * @returns {Promise.<String} the hash of the block
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

    /**
     * Verify whether or not the block has this transcation
     * @param {Transaction} transaction 
     */
    hasTransaction(transaction) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this.transactions.length; i++) {
                if (
                  this.transactions[i].hash == transaction.hash
                ) {
                  resolve(true);
                }
              }
              resolve(false)
        })
    }

    validate() {

    }
}