/**
 * Represents a peer in the network
 * @class Peer
 */
export class Peer{
    constructor(address, port) {
        this.address = address;
        this.port = port;
        this.connection = nulll;
    }
}