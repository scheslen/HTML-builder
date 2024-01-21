const fs = require('fs');
const path = require('path');
const { stdout } = process;

const txtStream = fs.createReadStream(path.join(__dirname, 'text.txt'),'utf-8');

txtStream.on('data', (data) => stdout.write(data));
