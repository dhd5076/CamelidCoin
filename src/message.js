/**
 * @module Message used for creating, parsing, and encoding messages
 */

/**
 * @class Message
 */
export class Message {
    constructor(type, payload) {
        //TODO: Assign random identifier
        this.type = type;
        this.payload = payload;
    }

    /**
     * Serialize the message into a Buffer
     * @returns {Promise.<Buffer>} A buffer of the serialized message object
     */
    serialize() {
        return new Promise((resolve, reject) => {
            const jsonString = JSON.stringify({
                command: this.command,
                payload: this.payload
            });
            const buffer = Buffer.from(jsonString);
            resolve(buffer);
        })
    }

    /**
     * Creates new message object from buffer
     * @param {Buffer} buffer;
     */
    static fromBuffer(buffer) {
        return new Promise((resolve, reject) => {
            const json = buffer.toString('utf8');
            const rawObject = JSON.parse(json);
            resolve(new Message(rawObject.command, rawObject.payload))
        });
    }
}