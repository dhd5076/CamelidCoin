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