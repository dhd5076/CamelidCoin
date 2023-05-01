/**
 * @module Network Used for handling sending and recieving data
 */
const net = require('net');

/**
 * @class Node Client
 * The TCP client for connecting to nearby nodes
 */
export class Node {
    /**
     * Create a new socket instance
     * @param {Peer[]} seedPeers seed peers for creating initial connections
     */
    constructor(seedPeers) {
        this.seedPeers = seedPeers;
        this.peers = [];
    }

    /**
     * Initialize Client
     */
    init() {
        return new Promise((resolve, reject) => {

            const server = net.createServer((socket) => {

            })

            this.seedPeers.forEach(peer => {
                const connection = net.createConnection({
                    host: peer.address,
                    port: peer.port
                });
                connection.on('connect', () => {
                    peer.connection = connection;
                    this.peers.push(peer);
                    this.handleConnection(connection)
                })
                connection.on('error', (error) => {
                    console.error(`Error connecting to peer ${peer.address}:${peer.port}: ${error.message}`);
                })
                peer.connection = connection;
            })
        })
    }

    /**
     * Handle incoming connections
     * @param {net.Socket} connection 
     */
    handleConnection(connection) {
        console.log('New connection from', connection.remoteAddress);

        connection.on('data', (data) => {
            const message = JSON.parse(data.toString());
            // TODO: Handle message
        });

        connection.on('close', () => {
            this.peers = this.peers.filter(peer => peer.connection !== connection);
        });

        connection.on('error', (err) => {
            //TODO: Handle error
        });
    }

    /**
     * Broadcast message to peers
     * @param {Message} message 
     */
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            this.peers.forEach(peer => {
                
            })
        })
    }
}