/**
 * @module Block used for handling blocks
 */

class Block {
    constructor(transcations, previousHash) {
        this.timestamp = new Date();
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
    }

    init() {
        this.hash = calculateHash();
    }

    calculateHash() {

    }

    hasTranscation() {

    }

    validate() {

    }
}