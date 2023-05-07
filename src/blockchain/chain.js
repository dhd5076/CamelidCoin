/**
 * @module Chain used for handling blockchain
 */
import level from 'level';
import { Block } from './block';

class Chain {
  constructor(dbPath) {
    this.db = level(dbPath);
  }

  /**
   * Add block to the blockchain
   * @param {Block} block The block to be added
   */
  addBlock(block) {}

  /**
   * Get the height of the blockchain
   * @returns {Promise.<number>} The height of the blockchain
   */
  getHeight() {}

  /**
   * Get the block at the given height
   * @param {number} height The height of the block
   * @returns {Promise.<Block>} The block at the given height
   */
  getBlock(height) {}

  /**
   * Get the block with the given hash
   * @param {string} hash The hash of the block
   * @returns {Promise.<Block>} The block with the given hash
   */
  getBlockByHash(hash) {}

  /**
   * Get all blocks with the given address in their transactions
   * @param {string} address The address to search for
   * @returns {Promise.<Array.<Block>>} An array of blocks with the given address in their transactions
   */
  getBlocksByAddress(address) {}

  /**
   * Get the current block difficulty
   * @returns {Promise.<number>} The current block difficulty
   */
  getDifficulty() {}

  /**
   * Get the blockchain as an array of blocks
   * @returns {Promise.<Array.<Block>>} An array of blocks in the blockchain
   */
  getChain() {}

  /**
   * Validate the blockchain
   * @returns {Promise.<boolean>} Whether or not the blockchain is valid
   */
  validateChain() {}

  /**
   * Get the balance for the given address
   * @param {string} address The address to get the balance for
   * @returns {Promise.<number>} The balance for the given address
   */
  getBalance(address) {}

  /**
   * Add transaction to the transaction pool
   * @param {Transaction} transaction The transaction to be added to the pool
   */
  addTransactionToPool(transaction) {}

  /**
   * Process pending transactions and mine a new block
   * @param {string} minerAddress The address of the miner
   * @returns {Promise.<Block>} The newly mined block
   */
  mineBlock(minerAddress) {}

  /**
   * Get the transaction pool
   * @returns {Promise.<Array.<Transaction>>} The transaction pool
   */
  getTransactionPool() {}

  /**
   * Clear the transaction pool
   */
  clearTransactionPool() {}
}