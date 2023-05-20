/**
 * @module Chain used for managing the blockchain
 */
import level from 'level';
import { Block } from './block';
import { Transcation } from './transaction';

export class Chain {
  constructor() {
  }

  /**
   * Initialize the chain, loads data from db file or creates one if it doesn't exist
   */
  init() {
    return new Promise((resolve, reject) => {
      this.db = level('./chain.db', { valueEncoding: 'json' })
      .then(() => {
        this.blocks = db.sublevel('blocks');
        this.transactions = db.sublevel('transactions');
        this.wallets = db.sublevel('wallets');
        resolve();
      })
      .catch((error) => {
        reject(new Error('Failed to initialize chain: ' + error.message))
      });
    });
  }

  /**
   * @method createGenesisBlock
   * @description Creates the genesis block
   * @returns {Promise.<null, Error>}
   */
  createGenesisBlock() {
    return new Promise((resolve, reject) => {
      const genesis = new Block(0, '0', Date.now(), [], 0);
      this.addBlock(genesis)
      .then(() => {
        resolve();
      });
    });
  }

  /**
   * @method addBlock
   * @description Add a block to the chain
   * @param {} block 
   * @returns {Promise.<null, Error>}
   */
  addBlock(block) {
    return new Promise((resolve, reject) => {
    });
  }

  /**
   * @method addTransaction
   * @description Add a transaction to the chain
   * @param {Transcation} transaction 
   * @returns {Promise.<null, Error>}
   */
  addTransaction(transaction) {
    return new Promise((resolve, reject) => {
    });
  }

  /**
   * @method getBlock
   * @description Get a block from the chain
   * @param {*} hash 
   * @returns {Promise.<Block, Error>}
   */
  getBlock(hash) {
    return new Promise((resolve, reject) => {
    });
  }

  /**
   * @method getTransaction
   * @description Get a transaction from the chain
   * @param {String} hash
   * @returns {Promise.<Transcation, Error>}
   */
  getTransaction(hash) {
    return new Promise((resolve, reject) => {
    });
  }

  /**
   * @method getWallet
   * @description Get info about a wallet
   * @param {String} address address of the wallet
   * @returns {Promise.<Wallet, Error>}
   */
  getWallet(address) {
    return new Promise((resolve, reject) => {
    });
  }
}