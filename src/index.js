/**
 * Entrypoint of the application
 */
import readline from 'readline';
import Client from './networking/network.js'

const client = new Client(25565, [{
  host: '192.168.1.11',
  port: '25565'
}]);
client.init()
.then(() => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  
  //BASIC READ PRINT EXECUTE cycle for testing, will be made more robust later
  const prompt = () => {
  
    rl.question('> ', (answer) => {
      console.log(`You entered: ${answer}`);
      prompt();
    });
  };
  prompt();

})
