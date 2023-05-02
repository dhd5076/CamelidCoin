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
     * Determines whether or not a message should be forwarded to neighbor nodes
     * @returns {Promise.<boolean>}
     */
    shouldForward() {
        return true;
        //TODO: Determine whether or not to broadcast message to
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
            const buffer = Buffer.from("MSG" + jsonString);
            resolve(buffer);
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
        this.handles.set(type, handler);
    }

    /**
     * Handle an incoming message
     * @param {Object} message - the incoming message
     * @returns {Promise.<null>} A Promise that resolves when the message has been handled successfully
     * and rejects if there's an error
     */
    handleMessage(message) {
        return new Promise((resolve, reject) => {
            if (!message || !message.type) {
                reject(new Error('Invalid message object'));
            }
        
            const handler = this.handlers.get(message.type);
            if (!handler) {
                //TODO: handle this for invalid message types
                reject(new Error(`No handler registered for message type ${message.type}`));
            }
        
            const messageObj = new Message(message.type, message.payload);
            handler(messageObj);
            if(this.shouldForward(message)) {
                this.sendMessage(message);
            }
            resolve();
        });
    }


}