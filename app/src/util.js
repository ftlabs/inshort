
/**
 * Converts a date to a uk formatted date string.
 * @param {*} date 
 */
function convertToUkDate(date) {
    date = date.split('-');
    return `${date[2]}-${date[1]}-${date[0]}` //Convert to uk format
}


export default {
    convertToUkDate
}