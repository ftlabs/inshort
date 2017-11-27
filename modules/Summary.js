const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const promiseParser = require('../helpers/xml2js-promise');
const striptags = require('striptags');
const pythonRunner = require('../helpers/python-runner');
const debug = require('debug')(`Summary:`);



/**
 * @param {*} searchTerm 
 */
function summarysForTimeRange(after, before) {
    let afterTime = after.split('-');
    afterTime = new Date(afterTime[2], afterTime[1] -1, 
        afterTime[0]).toISOString().replace('.000Z', 'Z');   

    let beforeTime = before.split('-');
    beforeTime = new Date(beforeTime[2], beforeTime[1] -1, 
        beforeTime[0]).toISOString().replace('.000Z', 'Z');   

    return fetchContent.searchBetweenRange(afterTime, beforeTime).then(response => {
        const sapiObj = response.sapiObj;
        const articles = [];
        if(sapiObj.hasOwnProperty('results')) {
            for(let article of sapiObj.results[0].results) {
                articles.push(article.id);
            }
        }
        return fetchItems(articles).then(responses => {
            return responses;
        })
    })
}

/**
 * Returns a sapiObj based on the given article ID
 * @param {*} id - Article ID 
 */
function fetchItem(id) {
    return fetchContent.getContentByID(id).then(article => {
        return {
            id: article.sapiObj.id,
            title: article.sapiObj.title,
            byline: article.sapiObj.byline,
            type: article.sapiObj.type,
            content: striptags(article.sapiObj.bodyXML, ["p", "body"])
        }
    })
}

/**
 * Returns a number of sapiObj based on the given article ID's
 * @param {*} id - Article ID 
 */
function fetchItems(idArray) {
    const itemPromisers = [];
    for (let id of idArray) {
        itemPromisers.push(() => extractFirstLine(id))
    }
    return directly(CAPI_CONCURRENCE, itemPromisers);
}

function extractiveSummarization(id, algorithm='lex-rank', length=5){
    debug(`Performing an extractive summary using the ${algorithm} algorithm with a length of ${length}`)
    return fetchItem(id).then(article => {
        const text = striptags(article.content).replace(/(\r\n|\n|\r)/gm,"");
        let command = `sumy ${algorithm} --length=${length} --format=plaintext --text='${text}'`;        
        return pythonRunner.runPython(command).then(response => {
            article.summary = response
            console.log(article)
            return article;
        })
    }).catch(error => console.log(error))
}


/**
 * Extracts the first paragraph from 
 * @param {*} id 
 */
function extractFirstParagraph(id) {
    return fetchItem(id).then(article => {
        const content = article.content;
        return promiseParser(content).then(result => {
            let paragraph = result.body.p[0];
            article.content = paragraph
            return article;
        })     
    })
}

/**
 * Extract the first line from a paragraph
 * @param {*} id 
 */
function extractFirstLine(id) {
    return extractFirstParagraph(id).then(article => {
        let paragraph = article.content; 
        article.content =  paragraph.split('.')[0]
        return article;
    });
}

module.exports = {
    extractFirstLine,
    summarysForTimeRange,
    extractiveSummarization
}