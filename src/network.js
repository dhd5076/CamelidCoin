const net = require('net');

/**
 * @class Client
 * The TCP client that connects to the server
 */
class Client {
    /**
     * Create a new socket instance
     * @param {String} address The address of the distributor 
     */
    constructor(address) {
        const socket = new net.Socket();
        socket.connect(8080, address, () => {
            console.log('Connected to server');
        })
        this.address = address;
        this.socket = client;
    }

    /**
     * Send a message to distributor
     * @param {Message} message 
     */
    sendMessage(message) {

    }
}

this.exports = Client;
