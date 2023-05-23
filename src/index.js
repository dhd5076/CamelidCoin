/**
 * Entrypoint of the application
 * Just using for testing right now
 * @todo Implement unit tests to replace informal debugging and mocks here
 */
import readline from 'readline';
import Client from './networking/client.js'
import logger from './utils/logger.js';

const client = new Client(25565, [{
  //Mock node for testing
  host: '192.168.1.11',
  port: '25565'
}], true, 'ggml-alpaca-7b-q4.bin');


logger.debug("Starting...");

client.init()
.then(() => {
  client.model.tokenizeString("Hello, world!").then((tokens) => {
    logger.debug(tokens);
  });
  client.model.generateCompletition("Hello, world!", 101, 128).then((tokens) => { 
    logger.debug(tokens.join(""));
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  
  //BASIC READ PRINT EXECUTE cycle for testing, will be made more robust later
  const prompt = () => {
  };
  prompt();

})
