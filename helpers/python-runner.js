const util = require('util')
const exec = util.promisify(require('child_process').exec);

function runPython(command) {
    return new Promise((resolve, reject) => {  
        exec(command).then(response => {
            if(response.stderr !== '') {
                return reject(response.stderr)
            }
            resolve(response.stdout);
        }).catch(error => reject(error))
    });
}

module.exports = {
    runPython
}