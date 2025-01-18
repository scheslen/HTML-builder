const fs = require('fs')
const path = require('path')

const inFolder = path.join(__dirname, 'styles');
const outFile = path.join(__dirname, 'project-dist', 'bundle.css');

let fileWriteStream = fs.createWriteStream(outFile)
fileWriteStream.end()

let txtReadStream

fs.readdir(inFolder, 'utf8', (err, aFiles) => {
  if (err) throw err
  for (let i in aFiles) {
    fs.stat(path.join(inFolder, aFiles[i]), function (err, stats) {
      if (err) throw err

      let sFN = aFiles[i];
      if (stats.isFile() && path.extname(sFN) === '.css') {
        txtReadStream = fs.createReadStream(
          path.join(__dirname, 'styles', sFN),
          'utf-8',
        ) //__dirname+'\\styles\\'+sFN
        txtReadStream.on('data', function (chunk) {
          fs.appendFile(outFile, chunk, (err) => {
            if (err) throw err
          })
        })
      }
    })
  }
})
