const fs = require('fs');
const path = require('path');

let folderPath=path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, 'utf8', (err, aFiles) => {
    if (err) throw err;
    for(let i in aFiles){

        fs.stat(path.join(folderPath,aFiles[i]), function(err, stats) {
            if (err) throw err;
            // if (err) console.error(err);

            if (stats.isFile()) {
                let sFN=aFiles[i];
                console.log(path.basename(sFN, path.extname(sFN)), '-', path.extname(sFN).slice(1), '-', (stats.size/1024).toFixed(3)+'kb');
                // console.log();
            }
        });

    }
});

