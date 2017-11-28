const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const promiseParser = require('../helpers/xml2js-promise');
const striptags = require('striptags');
const pythonRunner = require('../helpers/python-runner');
const debug = require('debug')('modules:summary');
const LOG_STYLES = require('../helpers/pretty-log');
const AVERAGE_READ_TIME = 200;

/**
 * Given a time range (after, before) retrieves the articles during the duration,
 * for it then performs the given summary method on each article.
 * Any extra parameters given after the summary method will be passed directly to the summary method.
 * i.e. (after, before, extractiveSummarization, 'text-rank', 5), with text-rank and 5 being
 * passed to the extractiveSummarization method.
 *
 * @param {*} after 
 * @param {*} before 
 * @param {*} summaryMethod 
 * @param {*} params 
 */
function summarysForTimeRange(after, before, summaryMethod, ...params) {
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
        return fetchItems(articles, summaryMethod, params).then(responses => {
            return responses;
        })
    })
}

/*  *
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
 * Returns a number of sapiObj based on the given article ID's (utilizing directly)
 * @param {*} id - Article ID 
 */
function fetchItems(idArray, summaryMethod, ...params) {
    params = params.pop();
    const itemPromisers = [];
    for (let id of idArray) {
        itemPromisers.push(() => summaryMethod.apply(null, [id, ...params]))
    }
    return directly(CAPI_CONCURRENCE, itemPromisers);
}

/** Summarization Methods Here */

/**
 * Performs extractive summrization on a given article
 * @param {*} id 
 * @param {*} algorithm - lex-rank, luhn, lsa, text-rank, sum-basic, kl, edmundson
 * @param {*} length 
 */
function extractiveSummarization(id, algorithm='lex-rank', length=2){
    console.log(LOG_STYLES.FG_BLUE, 
        `Performing an extractive summary using the ${algorithm} algorithm with a length of ${length}`);

    return fetchItem(id).then(article => {
        const text = striptags(article.content).replace(/(\r\n|\n|\r)/gm,"");
        let command = `sumy ${algorithm} --length=${length} --format=plaintext --text="${text}"`;        
        return pythonRunner.runPython(command).then(response => {
            article.summary = response            
            article = appendStatistics(article);
            return article;

        }).catch(error => {
            console.log(error);
            article.summary = null;
            return article;
        })
    })
}

/**
 * Adds reading statistics to the article object.
 * @param {*} article 
 */
function appendStatistics(article) {
    const contentWordCount = article.content.split(" ").length;
    const summaryWordCount = article.summary.split(" ").length;
    const deduction = ((contentWordCount - summaryWordCount)/contentWordCount)*100;
    const readTime = Math.round(contentWordCount / AVERAGE_READ_TIME);
    let summaryReadTime = Math.round(summaryWordCount / AVERAGE_READ_TIME);
    if (summaryReadTime < 1) 
        summaryReadTime = "Less than a"
    article['reading_time'] = `${readTime} Minutes`;
    article['summary_reading_time'] = `${summaryReadTime} minute`;
    article['deduction'] = `${Math.round(deduction)}%`;
    return article;
}


/**
 * Extracts the first paragraph from an article
 * @param {*} id 
 */
function extractFirstParagraph(id) {
    return fetchItem(id).then(article => {
        const content = article.content;
        return promiseParser(content).then(result => {
            let paragraph = result.body.p[0];
            article.summary = paragraph
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
        let paragraph = article.summary; 
        article.summary =  paragraph.split('.')[0]
        article = appendStatistics(article);
        return article;
    });
}

module.exports = {
    extractFirstLine,
    extractFirstParagraph,
    summarysForTimeRange,
    extractiveSummarization
}