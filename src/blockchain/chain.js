/**
 * @module Chain used for managing the blockchain
 */
import level from 'level';
import { Block } from './block';

class Chain {
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
        this.utxos = db.sublevel('utxos');
        this.addresses = db.sublevel('addresses');
        resolve();
      })
      .catch((error) => {
        reject(new Error('Failed to initialize chain: ' + error.message))
      });
    });
  }

  /**
   * Create and add genesis block to the chain
   */
  createGenesisBlock() {
    return new Promise((resolve, reject) => {
      const genesis = new Block(0, '0', Date.now(), [], 0);
      this.blocks.put(genesis.hash, genesis)
    });
  }

  addBlock(block) {
  }

  addTransaction(transaction) {
  }

  getBlock(hash) {
  }

  getTransaction(hash) {
  }

  getUTXO(address) {
  }

  getAddress(address) {
  }
}