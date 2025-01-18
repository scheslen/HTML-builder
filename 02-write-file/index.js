const fs = require('fs')
const path = require('path')
const process = require('process')
const readline = require('readline')

let fileWriteStream = fs.createWriteStream(path.join(__dirname, 'text.txt'))
let readInput = readline.createInterface({input: process.stdin, output: process.stdout})

console.log('--- Hello! Input text, please. Ctrl+C or "exit" - end of input.')

readInput.setPrompt('> ')
readInput.prompt()

readInput.on('line', (input) => {
  if (input.toLowerCase().trim() === 'exit') {
    readInput.close()
  } else {
    fileWriteStream.write(`${input}\n`)
    readInput.prompt()
  }
});

readInput.on('SIGINT', () => {
  readInput.close()
});

readInput.on('close', () => {
  console.log('--- Input is over. Thank you.')
  fileWriteStream.end()
})
