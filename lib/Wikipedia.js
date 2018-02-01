const fetch = require('node-fetch');
const wikipediaUrl = 'https://en.wikipedia.org/api/rest_v1/';


/**
 * Given a wikipedia title, fetches the content
 * @param {*} title 
 */
function fetchSummaryForTitle(title) {
    title = title.replace(/\s/g, "_");
    apiUrl = `${wikipediaUrl}page/summary/${title}`
    return fetch(apiUrl)
    .then(res => res.json())
    .catch(error => {
        console.log(error)
    });
}

module.exports = {
    fetchSummaryForTitle
}