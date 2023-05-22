import net from 'net'
//TODO update to use export default if no other classes to import from modules
import { JobManager } from '../model/jobManager.js'
import { Message } from './message.js';
import { Model } from '../model/model.js';
import { Peer } from './peer.js';
import { Chain } from '../blockchain/chain.js';
import { MessageHandler } from './messageHandler.js';
import logger from '../utils/logger.js'

/**
 * @class Client
 * @classdesc Represents a node client
 */
class Client {
    /**
     * Create a new socket instance
     * @param {Number} port starting port
     * @param {Peer[]} seedPeers seed peers for creating initial connections
     * @param {Boolean} fullNode run as full node, otherwise runs as lightweight client
     * @param {Model} modelFile LLM model to use for computation and/or verification
     */
    constructor(port, seedPeers = [], fullNode, modelFile) {
        logger.debug(`New tcp client created with ${seedPeers.length} peers.`)
        this.messageHandler = new MessageHandler(this.sendMessage);
        this.jobManager = new JobManager(this.messageHandler, fullNode)
        this.messageHandler.registerHandler('')
        this.model = new Model(modelFile);
        this.port = port
        this.chain = new Chain
        if(seedPeers.length > 0) {
            this.peers = seedPeers;
        } else {
            throw new Error("Seed peers are required for client instance");
        }
    }

    /**
     * Handles LIST_PEERS command
     */
    handleGetPeersMessage(message) {
        reply(new Message('LIST_PEERS', this.peers));
    }

    /**
     * @method init
     * @description Initialize the client
     * @returns {Promise.<null, Error>}
     */
    init() {
        return new Promise((resolve, reject) => {

            this.model.init().then(async () => {

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
            }).catch((error) => {   
                reject(new Error(`Error initializing client: ${error.message}`));
            });
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
            this.messageHandler.handleMessage(Message.fromBuffer(data))
            .then((message) => {
                if(message) {
                    this.sendMessage(message);
                }
            });
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