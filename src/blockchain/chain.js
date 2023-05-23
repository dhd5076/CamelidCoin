/**
 * @module Chain used for managing the blockchain
 * @author Dylan Dunn
 */
import level from 'level';
import { Block } from './block.js';
import { Transaction } from './transaction.js';

export class Chain {
  /**
   * @constructor
   * @param {String} dbLocation
   */
  constructor(dbLocation) {
    this.dbLocation = dbLocation;
  }

  /**
   * Initialize the chain, loads data from db file or creates one if it doesn't exist
   */
  init() {
    return new Promise((resolve, reject) => {
      this.db = level(this.dbLocation, { valueEncoding: 'json' })
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
   * @method setBlock
   * @description set or update a block in the chain
   * @param {} block 
   * @returns {Promise.<null, Error>}
   */
  setBlock(block) {
    return new Promise((resolve, reject) => {
      this.db.put(`blocks:${block.hash}`, block)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(new Error('Failed to add block: ' + error.message));
      });
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
      this.db.get(`blocks:${hash}`)
      .then((block) => {
        resolve(block);
      })
      .catch((error) => {
        reject(new Error('Failed to get block: ' + error.message));
      });
    });
  }

  /**
   * @method setTransaction
   * @description Set or update a transaction to the chain
   * @param {Transcation} transaction 
   * @returns {Promise.<null, Error>}
   */
  setTransaction(transaction) {
    return new Promise((resolve, reject) => {
      this.db.put(`transactions:${transaction.hash}`, transaction)
      .then(resolve)
      .catch((error) => {
        reject(new Error('Failed to add transaction: ' + error.message));
      });
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
      this.db.get(`transactions:${hash}`)
      .then((transaction) => {
        resolve(transaction);
      })
      .catch((error) => {
        reject(new Error('Failed to get transaction: ' + error.message));
      });
    });
  }

  /**
   * @method setWallet
   * @description Add or update an wallet in the chain
   * @param {Wallet} wallet
   * @returns {Promise.<null, Error>}
   */
  setWallet(wallet) {
    return new Promise((resolve, reject) => {
      this.db.put(`wallets:${wallet.address}`, wallet)
      .then(resolve)
      .catch((error) => {
        reject(new Error('Failed to add wallet: ' + error.message));
      });
    });
  }

  /**
   * @method getWallet
   * @description Get a wallet form the chain
   * @param {String} address address of the wallet
   * @returns {Promise.<Wallet, Error>}
   */
  getWallet(address) {
    return new Promise((resolve, reject) => {
      this.db.get(`wallets:${address}`)
      .then((wallet) => {
        resolve(wallet);
      })
      .catch((error) => {
        reject(new Error('Failed to get wallet: ' + error.message));
      });
    });
  }
}