import net from 'net'
//TODO update to use export default if no other classes to import from modules
import { JobManager } from '../model/jobManager.js'
import { Message } from './message.js';
import { MessageHandler } from './messageHandler.js';
import logger from '../utils/logger.js'

/**
 * @class Node Client
 * The TCP client for connecting to nearby nodes
 */
class Client {
    /**
     * Create a new socket instance
     * @param {Number} port starting port
     * @param {Peer[]} seedPeers seed peers for creating initial connections
     * @param {Boolean} fullNode run as full node, otherwise runs as lightweight client
     */
    constructor(port, seedPeers = [], fullNode) {
        logger.debug(`New tcp client created with ${seedPeers.length} peers.`)
        this.messageHandler = new MessageHandler(this.sendMessage);
        this.jobManager = new JobManager(this.messageHandler, fullNode)
        this.messageHandler.registerHandler('');
        this.port = port
        if(seedPeers.length > 0) {
            this.peers = seedPeers;
        } else {
            throw new Error("Seed peers are required for client instance");
        }
    }

    /**
     * Handles LIST_PEERS command
     */
    handleGetPeersMessage(message, reply) {
        reply(new Message('LIST_PEERS', this.peers));
    }

    /**
     * Initialize Client
     */
    init() {
        return new Promise(async (resolve, reject) => {

            const server = await net.createServer((connection) => {
                logger.debug(`New connection from ${connection.remoteAddress}:${connection.remotePort}`);
                this.handleConnection(connection);
            })

            server.listen(this.port, () => {
                logger.debug(`Server listening on port ${this.port}`);
            })

            await this.peers.forEach(peer => {
                const connection = net.createConnection({
                    host: peer.address,
                    port: peer.port
                });
                connection.on('connect', () => {
                    this.handleConnection(connection)
                })
                connection.on('error', (error) => {
                    logger.error(`Error connecting to peer ${peer.address}:${peer.port}: ${error.message}`)
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
        // Handle client connection
        connection.on('data', (data) => {
            const message = Message.fromBuffer(data);
            /**
             * Used for replying to a node
             * @param {Message} msgToSend message to send to reply with
             */
            const reply = (msgToSend) => {
                msgToSend.serialize()
                .then((serializedMessage) => {
                    connection.write(serializedMessage);
                })
                .catch((error) => {
                    logger.error(`Error serializing message: ${error.message}`);
                })
            }
            this.messageHandler.handleMessage(Message.fromBuffer(data), reply);
        });

        // Handle peer disconnection
        connection.on('close', () => {
            logger.debug(`Peer ${connection.remoteAddress}:${connection.remotePort} disconnected`);
            this.peers = this.peers.filter(peer => peer.connection !== connection);
        });

        connection.on('error', (error) => {
            logger.error(`Error with connection to ${connection.remoteAddress}:${connection.remotePort}: ${error.message}`);
        });
    }

    /**
     * Broadcast message to peers
     * @param {Message} message 
     */
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            this.peers.forEach(peer => {
                const socket = peer.connection;
                message.serialize()
                .then((serializedMessage))
            });
            resolve();
        });
    }
}

export default Client;