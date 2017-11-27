const xml2js = require('xml2js').parseString;

function promiseParser (xmlString) {
    return new Promise((resolve, reject) =>{
        xml2js(xmlString, (err, result) =>{
             if(err){
                 reject(err);
             }
             else {
                 resolve(result);
             }
        });
    });
}

module.exports = promiseParser