const net = require('net');

// Create a TCP server that listens on port 3000
const server = net.createServer((socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

  // Handle incoming data from the client
  socket.on('data', (data) => {
    console.log(`Received data from client: ${data.toString()}`);
  });

  // Handle socket close event
  socket.on('close', () => {
    console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
  });
});

server.listen(3000, () => {
  console.log('Server started');
});
