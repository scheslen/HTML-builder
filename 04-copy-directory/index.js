const path = require('path')
let fs = require('fs');

const inFolder = path.join(__dirname, "files");
const outFolder = path.join(__dirname, "files-copy");

function copyDir(){

  fs.readdir(outFolder, 'utf8', (err, aDFiles) => {
    if (!err) {
      for(let k in aDFiles){
        fs.unlink(path.join(outFolder, aDFiles[k]), err => {
          if(err) throw err;
          console.log(aDFiles[k],' - deleted');
        });
      }
    }
  });

  fs.mkdir(outFolder, { recursive: true }, err => {
    if(err) throw err;

    console.log(outFolder + ' - folder created');
    fs.readdir(inFolder, 'utf8', (err, aFiles) => {
      if (err) throw err;

      for(let i in aFiles){
        fs.copyFile(path.join(inFolder, aFiles[i]), path.join(outFolder, aFiles[i]), err => {
          if(err) throw err;
          console.log(aFiles[i]+' - file copied');
        });
      }
     });

  });

};

copyDir();