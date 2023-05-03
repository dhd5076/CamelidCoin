/**
 * @module Network Used for handling sending and recieving data
 */
import net from 'net'
import { Message, MessageHandler } from './message';

/**
 * @class Node Client
 * The TCP client for connecting to nearby nodes
 */
export class Client {
    /**
     * Create a new socket instance
     * @param {Peer[]} seedPeers seed peers for creating initial connections
     */
    constructor(seedPeers) {
        this.messageHandler = new MessageHandler(this.sendMessage);
        this.messageHandler.registerHandler('')
        if(seedPeers != null) {
            this.seedPeers = seedPeers;
            this.peers = [];
        } else {
            throw new Error("Seed peers are required for client instance");
        }
    }

    /**
     * Handles GetPeers command
     */
    handleGetPeersMessage(message, reply) {
        const message = new Message('')
        //TODO: Implement replying to user with list of peers
    }

    /**
     * Initialize Client
     */
    init() {
        return new Promise(async (resolve, reject) => {

            const server = await net.createServer((connection) => {
                this.handleConnection(connection);
            })

            server.listen(8080, () => {
                console.log("Listening for incoming connections");
            })

            await this.seedPeers.forEach(peer => {
                const connection = net.createConnection({
                    host: peer.address,
                    port: peer.port
                });
                connection.on('connect', () => {
                    this.handleConnection(connection)
                })
                connection.on('error', (error) => {
                    console.error(`Error connecting to peer ${peer.address}:${peer.port}: ${error.message}`);
                })
                peer.connection = connection;
            })
            resolve();
        })
    }

    /**
     * Handle incoming connections
     * @param {net.Socket} connection 
     */
    handleConnection(connection) {
        connection.on('data', (data) => {
            this.messageHandler.handleMessage(Message.fromBuffer(data), sender);
        });

        connection.on('close', () => {
            this.peers = this.peers.filter(peer => peer.connection !== connection);
        });

        connection.on('error', (err) => {
            throw new Error(error);
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

const a = new Client([{
    host: 'localhost',
    port: 8080
}]);
a.init();