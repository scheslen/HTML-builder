const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

let fileWriteStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
let readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hello! Input text, please. Ctrl+C or "exit" - end of input.');

readInterface.setPrompt('> ');
readInterface.prompt();

readInterface.on('line', (input) => {
  if (input.toLowerCase().trim() === 'exit') {
    readInterface.close();
  } else {
    fileWriteStream.write(input + '\n');
    readInterface.prompt();
  }
});

readInterface.on('close', () => {
  console.log('--- Input is over. Thank you.');
  fileWriteStream.end();
});
