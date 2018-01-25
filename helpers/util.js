/**
 * Converts a date in UK format to be compatible with SAPI calls
 * @param {*} time 
 */
function convertDateToSAPI(time) {
    return parseUKdate(time).toISOString().replace('.000Z', 'Z'); 
}

/**
 * Sorts an array of objects by key value
 * Append a minus to the value to sort the array in reverse
 * @param {*} property 
 */
function dynamicSort(property) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/**
 * Performs a binary search through a array of sorted objects 
 * and returns the object.
 * @param {*} array 
 * @param {*} val 
 */
function bsearchObjectArray(array, val, key) {
    let start = 0;
    let end = array.length - 1
    while(true) {
        let mid = Math.floor((start + end) / 2)
        if(array[mid][key] == val) {
            return array[mid][key]
        }
        else if(val > array[mid][key]) {
            start = mid + 1;
        }
        else {
            end = mid - 1;
        }
    }
}


/**
 * Parses a UK date string and returns a Date Object.
 * @param {*} time 
 */
function parseUKdate(time) {
    let timeArray;
    if (time.includes("-")) timeArray = time.split('-')
    else if (time.includes("/")) timeArray = time.split('/')
    else return null
    return new Date(timeArray[2], timeArray[1] -1, timeArray[0])
}

/**s
 * Calculates the number of days between two dates
 * @param {*} firstDate
 * @param {*} secondDate
 */
function daysBetween(firstDate, secondDate) {
    const oneDay = 24*60*60*1000;
    console.log(firstDate);
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

module.exports = {
    convertDateToSAPI,
    daysBetween,
    parseUKdate,
    dynamicSort,
    bsearchObjectArray
}