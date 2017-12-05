const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly');
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE')) ? process.env.CAPI_CONCURRENCE : 4;
const promiseParser = require('../helpers/xml2js-promise');
const striptags = require('striptags');
const pythonRunner = require('../helpers/python-runner');
const debug = require('debug')('modules:summary');
const util = require('../helpers/util');
const LOG_STYLES = require('../helpers/pretty-log');

//CONSTANTS
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
function summarysForTimeRange(after, before, summaryMethod = fetchItem, ...params) {
    let afterTime = util.convertDateToSAPI(after);
    let beforeTime = util.convertDateToSAPI(before);
    return fetchContent.searchBetweenRange(afterTime, beforeTime).then(response => {
        const articles = _constructIDArray(response.sapiObj);
        return fetchItems(articles, summaryMethod, params)
    })
}

/**
 * Same as summarysForTimeRange, however also takes a search parameter.
 * @param {*} searchTerm 
 * @param {*} after 
 * @param {*} before 
 * @param {*} summaryMethod 
 * @param {*} params 
 */
function articlesForSearchTerm(searchTerm, after, before, summaryMethod = fetchItem, ...params) {
    let afterTime = util.convertDateToSAPI(after);
    let beforeTime = util.convertDateToSAPI(before);
    return fetchContent.searchBetweenRange(afterTime, beforeTime, searchTerm).then(resp => {
        const articles = _constructIDArray(resp.sapiObj);
        return fetchItems(articles, summaryMethod, params)
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
            standfirst: article.sapiObj.standfirst,
            firstPublishedDate: article.sapiObj.firstPublishedDate,
            url: article.sapiObj.webUrl,
            byline: article.sapiObj.byline,
            type: article.sapiObj.type,
            content: striptags(article.sapiObj.bodyXML, ["p", "body"])
        }
    })
}

/**
 * Returns a number of sapiObj based on the given article ID's (utilizing directly)
 * @param {*} id - Article ID 
 * @private
 */
function fetchItems(idArray, summaryMethod, ...params) {
    params = params.pop();
    const itemPromisers = [];
    for (let id of idArray) {
        itemPromisers.push(() => summaryMethod.apply(null, [id, ...params]))
    }
    return directly(CAPI_CONCURRENCE, itemPromisers);
}

/**
 * Adds reading statistics to the article object.
 * @param {*} article 
 */
function appendStatistics(article) {
    const contentWordCount = article.content.split(" ").length;
    const summaryWordCount = article.summary.split(" ").length;
    const deduction = ((contentWordCount - summaryWordCount) / contentWordCount) * 100;
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
 * Given a SapiObj, returns an array of article ID's
 */
function _constructIDArray(sapiObj) {
    const articles = [];
    const results = sapiObj.results;
    if (results.length > 0 && results[0].hasOwnProperty('results')) {
        for (let article of sapiObj.results[0].results) {
            articles.push(article.id);
        }
    }
    return articles;
}

/** Summarization Methods Here */

/**
 * Performs extractive summrization on a given article
 * @param {*} id 
 * @param {*} algorithm - lex-rank, luhn, lsa, text-rank, sum-basic, kl, edmundson
 * @param {*} length 
 */
function extractiveSummarization(id, algorithm = 'lex-rank', length = 2) {
    console.log(LOG_STYLES.FG_BLUE,
        `Performing an extractive summary using the ${algorithm} algorithm with a length of ${length}`);

    return fetchItem(id).then(article => {
        const text = striptags(article.content).replace(/(\r\n|\n|\r)/gm, "");
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
        article.summary = paragraph.split('.')[0]
        article = appendStatistics(article);
        return article;
    });
}

/**
 * Given an ID, performs all summary methods on a given article
 * @param {*} id 
 */
function extractAllSummarys(id) {
    return Promise.all([
        extractFirstLine(id),
        extractFirstParagraph(id),
        extractiveSummarization(id)
    ]).then(([firstLine, firstParagraph, extractive]) => {
        return {
            'first-line': firstLine,
            'first-paragraph': firstParagraph,
            'extractive': extractive
        }
    })
}

module.exports = {
    extractFirstLine,
    extractFirstParagraph,
    summarysForTimeRange,
    extractiveSummarization,
    extractAllSummarys,
    articlesForSearchTerm,
    fetchItem
}