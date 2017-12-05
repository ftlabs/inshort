/**
 * Converts a date in UK format to be compatible with SAPI calls
 * @param {*} time 
 */
function convertDateToSAPI(time) {
    let timeArray;
    if (time.includes("-")) timeArray = time.split('-')
    else if (time.includes("/")) timeArray = time.split('/')
    else return null
    return new Date(timeArray[2], timeArray[1] -1, timeArray[0]).toISOString().replace('.000Z', 'Z'); 
}

module.exports = {
    convertDateToSAPI,
}