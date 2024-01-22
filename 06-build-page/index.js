const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist'); //__dirname\\project-dist

const oHtmlComponents = {};
let sHtmlIndex = '';
let qComponents = 0;

fs.mkdir(distFolder, { recursive: true }, (err) => {
  if (err) throw err;
  createHtml();

  createStyle( path.join(__dirname, 'styles'), path.join(distFolder, 'style.css'),);

  copyDir(path.join(__dirname, 'assets'), path.join(distFolder, 'assets'));
});

// ..................................................................

function createHtml() {
  let txtReadTempStream = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );

  let htmlTemplate = '';
  let pTag = -1;
  let pTagEnd = 0;

  txtReadTempStream.on('data', function (tempChunk) {
    htmlTemplate = tempChunk;
    sHtmlIndex += htmlTemplate;

    while (htmlTemplate.length > 0) {
      pTag = htmlTemplate.indexOf('{{');

      if (pTag < 0) {
        htmlTemplate = '';
      } else {
        pTagEnd = htmlTemplate.indexOf('}}');
        oHtmlComponents[htmlTemplate.slice(pTag + 2, pTagEnd)] = '';
        qComponents += 1;
        htmlTemplate = htmlTemplate.slice(pTagEnd + 2);
      }
    }
  });

  txtReadTempStream.on('end', () => {
    for (let key in oHtmlComponents) {
      fs.readFile(
        path.join(__dirname, 'components', `${key}.html`),
        'utf8',
        function (err, txtComponent) {
          if (err) throw err;
          oHtmlComponents[key] = txtComponent;
          qComponents -= 1;
          if (qComponents === 0) writeHtml();
        })
    }
  });

  function writeHtml() {
    let fileWriteStream = fs.createWriteStream(path.join(distFolder, 'index.html'),{encoding: 'utf8'});

    for (let key in oHtmlComponents) {
      sHtmlIndex = sHtmlIndex.replace(`{{${key}}}`, oHtmlComponents[key]);
    }
    fileWriteStream.write(sHtmlIndex);
    fileWriteStream.end();
  };
}

// ..................................................................

function createStyle(styleFolder, styleFile) {
  let fileWriteStream = fs.createWriteStream(styleFile);
  fileWriteStream.end();
  let txtReadStream;

  fs.readdir(styleFolder, 'utf8', (err, aFiles) => {
    if (err) throw err;
    for (let i in aFiles) {
      fs.stat(path.join(styleFolder, aFiles[i]), function (err, stats) {
        if (err) throw err;

        let sFN = aFiles[i];
        if (stats.isFile() && path.extname(sFN) === '.css') {
          txtReadStream = fs.createReadStream(
            path.join(styleFolder, sFN),
            'utf-8',
          );
          txtReadStream.on('data', function (chunk) {
            fs.appendFile(styleFile, chunk, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    }
  });
}

// ..................................................................

function copyDir(inFolder, outFolder) {
  fs.mkdir(outFolder, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(inFolder, 'utf8', (err, aFiles) => {
      if (err) throw err;

      for (let i in aFiles) {
        fs.stat(path.join(inFolder, aFiles[i]), function (err, stats) {
          if (err) throw err;
          // if (err) console.error(err);

          if (stats.isFile()) {
            fs.copyFile(
              path.join(inFolder, aFiles[i]),
              path.join(outFolder, aFiles[i]),
              (err) => {
                if (err) throw err;
              },
            );
          }
          if (stats.isDirectory()) {
            copyDir(
              path.join(inFolder, aFiles[i]),
              path.join(outFolder, aFiles[i])
            );
          }
        });
      }
    });
  });
}
