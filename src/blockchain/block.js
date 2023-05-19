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
     * Get's the merkle proof for a given transaction
     * @param {String} id the id of the transaction
     */
    getMerkleProof(id) {

    }

    /**
     * Calcaulte the merkle root of the block
     * @returns {Promise.<String>} the merkle root of the block
     */
    calculateMerkleRoot() {
        return new Promise((resolve, reject) => {
        });
    }

    /**
     * TODO:  Figure out why I added this function and if I can remove it
     */
    createInput() {
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * Validates whether or not the block is valid
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