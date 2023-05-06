/**
 * @module Message used for creating, parsing, and encoding messages
 */

import crypto from 'crypto';

const forwardableMessages = [TYPES.JOB_NEW, TYPES.JOB_ACCEPTED. TYPES.JOB_COMPLETED]

/**
 * @class Message
 */
export class Message {
    /**
     * Create a new message
     * @param {String} type the type of the message, used for transmitting to handlers
     * @param {Object} payload an object representing the payload of the message
     */
    constructor(type, payload) {
        //TODO: Assign random identifier, want to prevent message getting stuck in network, loops, etc
        this.type = type;
        this.payload = payload;
        this.hash = hash;
    }

    static get TYPES() {
        return {
        JOB_NEW: 0,
        JOB_ACCEPTED: 1,
        JOB_COMPLETED: 2,
        }
    }

    /**
     * Calculates the hash of the message
     * @param 
     */
    calculateHash() {
        return new Promise((resolve, reject) => {
            const hash = crypto.calculateHash('sha256');
            hash.update(data);
            resolve(hash.digest('hex'))
        })
    }

    /**
     * @returns {Promise.<Boolean} whether or not the message should be forwarded 
     */
    shouldForward() {
        return forwardableMessages.includes(this.type);
    }

    /**
     * Serialize the message into a buffer
     * @returns {Promise.<Buffer>} A buffer of the serialized message object
     */
    serialize() {
        return new Promise((resolve, reject) => {
            try {
                const jsonString = JSON.stringify({
                    command: this.command,
                    payload: this.payload,
                    hash: this.hash
                });
                const buffer = Buffer.from(jsonString);
                resolve(buffer);
            } catch(error) {
                reject(error)
            }
        })
    }

    /**
     * Creates new message object from buffer
     * @param {Buffer} buffer;
     */
    static fromBuffer(buffer) {
        return new Promise((resolve, reject) => {
            const json = buffer.toString('utf8').substring(3);
            const rawObject = JSON.parse(json);
            resolve(new Message(rawObject.command, rawObject.payload))
        });
    }
}


/**
 * @class MessageHandler
 */
export class MessageHandler {
    /**
     * @param {function} sendMessage function to handle sending messages
     */
    constructor(sendMessage) {
        this.handles = new Map();
        this.sendMessage = sendMessage;
    }

    /**
     * Register a callback to handle a specific message type
     * @param {string} type - the type of message to handle
     * @param {function} handler - the callback to handle the message
     */
    registerHandler(type, handler) {
        return new Promise((resolve, reject) => {
            this.handles.set(type, handler);
            resolve();
        })
    }

    /**
     * Handle an incoming message
     * @param {Message} message - the incoming message
     * @param {function} reply - send message back to sender
     * @returns {Promise.<null>} A Promise that resolves when the message has been handled successfully
     * and rejects if there's an error
     */
    handleMessage(message, reply) {
        return new Promise((resolve, reject) => {
            if (!message || !message.type) {
                reject(new Error('Invalid message object'));
            }

            const handler = this.handlers.get(message.type);
            if (!handler) {
                //TODO: handle this for invalid message types
                reject(new Error(`No handler registered for message type ${message.type}`));
            };
            handler(message, reply);
            if(this.shouldForward(message)) {
                this.sendMessage(message, this.sendMessage);
            }
            resolve();
        });
    }


}