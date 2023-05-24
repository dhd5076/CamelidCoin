/**
 * Entrypoint of the application
 * Just using for testing right now
 * @todo Implement unit tests to replace informal debugging and mocks here
 */
import readline from 'readline';
import Client from './networking/client.js'
import logger from './utils/logger.js';
import { Job } from './model/job.js';

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
  client.model.generateCompletition("Hello, world!", 101, 30).then((tokens) => { 
    const tokensJoined = tokens.join("")
    const newString = tokens.slice(0, tokens.length - 10).join("");
    //logger.debug(tokensJoined);
    client.model.generateCompletition(newString, 101, 10).then((tokens2) => {
      logger.debug(tokens2.join(""));

      const job = new Job("Hello, world!", 101, 30, null, Date.now(), tokens)

      client.model.validateSingleToken(job, 0).then((valid) => {
        console.log("Token 0 is valid: " + valid);
      });

      client.model.validateSingleToken(job, 10).then((valid) => {
        console.log("Token 10 is valid: " + valid);
      });

      client.model.validateSingleToken(job, 20).then((valid) => {
        console.log("Token 20 is valid: " + valid);
      });

      client.model.verifyCompletedJob(job).then((valid) => {
        logger.debug("Job is valid: " + valid);
      }).catch((error) => {
        throw error;
      });
    });
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
