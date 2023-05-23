/**
 * @module Block used for handling blocks
 * @author Dylan Dunn
 */

import { getHash } from '../utils/cryptoUtils.js';
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
        this.merkleRoot = this.calculateMerkleRoot(); //TODO: check for race condition
        this.hash = calculateHash();
    }

    /**
     * @method createMerkleProof
     * @description Creates a merkle proof for a given transaction, used to prove that a transaction is in a block for light clients
     * @param {String} hash the hash of the transaction to prove
     * @returns {Promise.<null, Error>}
     */
    getMerkleProof(id) {
        return new Promise((resolve, reject) => {
            const transactions = this.transactions;
        
            const targetTransaction = transactions.find(transaction => transaction.hash === hash);
        
            if (!targetTransaction) {
                reject(new Error('Transaction not found'));
            }
        
            const merkleProof = [];

            const targetIndex = transactions.findIndex(transaction => transaction.hash === hash);

            let currentIndex = targetIndex;
            let currentHash = targetTransaction.hash;

            while (currentIndex >= 0) {
                const siblingIndex = currentIndex % 2 === 0 ? currentIndex + 1 : currentIndex - 1;
                const siblingHash = siblingIndex < transactions.length ? transactions[siblingIndex].hash : currentHash;

                const concatenatedHash = siblingIndex < currentIndex ? siblingHash + currentHash : currentHash + siblingHash;

                getHash(concatenatedHash).then(hash => {
                    hashedValue = hash;
                }).then(() => {
                    merkleProof.push(siblingHash);

                    currentHash = hashedValue;
                    currentIndex = Math.floor(currentIndex / 2);
                });
            }

            resolve(merkleProof);
        });
    }

    /**
     * @method verifyMerkleProof
     * @description Verifies the validity of a Merkle proof for a given transaction
     * @param {String} hash the hash of the transaction
     * @param {String} merkleRoot the Merkle root of the block
     * @param {Array} merkleProof the Merkle proof for the transaction
     * @returns {Boolean} true if the Merkle proof is valid, false otherwise
     */
    verifyMerkleProof(hash, merkleRoot, merkleProof) {
        return new Promise(async (resolve, reject) => {
            const targetTransactionHash = this.transactions.find(transaction => transaction.hash === hash)?.hash;
        
            if (!targetTransactionHash) {
                reject(new Error('Transaction not found'));
            }
        
            let computedHash = targetTransactionHash;
        
            for (const siblingHash of merkleProof) {
                const concatenatedHash = computedHash < siblingHash ? computedHash + siblingHash : siblingHash + computedHash;
                await getHash(concatenatedHash)
                    .then(hashedValue => {
                        computedHash = hashedValue;
                    });
            }
        
            resolve(computedHash === merkleRoot);
        });
    }

    /**
     * @method calculateMerkleRoot
     * @description Calculates the merkle root of the block
     * @returns {Promise.<String, Error>} the merkle root of the block
     */
    calculateMerkleRoot() {
        return new Promise(async (resolve, reject) => {
            const transactions = this.transactions;

            if(transactions.length === 0) {
                resolve("");
            } 

            let merkleTree = transactions.map(transaction => transaction.hash);

            while(merkleTree.length > 1) {
                const nextLevel = [];

                for(let i = 0; i < merkleTree.length; i += 2) {
                    const left = merkleTree[i];
                    const right = merkleTree[i + 1] || left; //In case of odd number of hashes

                    //TODO make sure this stops race condition with for loop
                    await getHash(left + right).then(hash => {
                        nextLevel.push(hash);
                    });
                }

                merkleTree = nextLevel;
            }

            const merkleRoot = merkleTree[0];

            resolve(merkleRoot);
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