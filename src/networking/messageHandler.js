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
            try {
                this.handles.set(type, handler);
                resolve();
            } catch(error) {
                reject(error);
            }
        })
    }

    /**
     * Handle an incoming message
     * @param {Message} message - the incoming message
     * @returns {Promise.Message} A message to send back to the sender, optional
     */
    handleMessage(message) {
        return new Promise((resolve, reject) => {
            if (!message || !message.type) {
                reject(new Error('Invalid message object'));
            }

            const handler = this.handlers.get(message.type);
            if (!handler) {
                reject(new Error(`No handler registered for message type ${message.type}`));
            } else {
                handler(message)
                .then(message => resolve(message))
            }
        });
    }


}