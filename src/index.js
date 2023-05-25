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

/**TODO: Will probably need to write a custom llama.cpp equivalent.
 * It's not structured appopriately for our use case.
 * Loading the prompt and model in and out of memory is not efficient
 **/


logger.debug("Starting...");

client.init()
.then(() => {
  /**
   * TODO: fix new errors with tokenize method
  client.model.tokenizeString("Hello, world!").then((tokens) => {
    logger.debug(tokens);
  });
  **/

  const prompt = "1000 word essay: "
  console.time("generateCompletition")
  client.model.generateCompletition(prompt, 101, 256).then((tokens) => { 
    const job = new Job(prompt, 101, 100, null, Date.now(), tokens);
    console.timeEnd("generateCompletition");
    console.time("verifyCompletedJob");
    client.model.verifyCompletedJob(job).then((valid) => {
      console.timeEnd("verifyCompletedJob");
      logger.debug("Job is valid: " + valid);
    }).catch((error) => {
      throw error;
    });
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
})
