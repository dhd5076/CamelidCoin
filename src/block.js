/**
 * @module Block used for handling blocks
 */

import {Transaction, Transcation} from './transaction';

const creationReward = 0;

class Block {
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
     * 
     */
    getMerkleProof() {

    }

    /**
     * 
     */
    getMerkleRoot() {

    }

    /**
     * 
     */
    createInput() {
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * 
     */
    validate() {
        return new Promise((resolve, reject) => {

        })
    }


    /**
     * 
     */
    getGenesis() {
        return new Promise((resolve, reject) => {
            const genesis  = new Block(
                //Genesis data
            );
            genesis.hash = this.calculateHash(block)
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
}