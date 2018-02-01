const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly');
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE')) ? process.env.CAPI_CONCURRENCE : 4;
const promiseParser = require('../helpers/xml2js-promise');
const striptags = require('striptags');
const pythonRunner = require('../helpers/python-runner');
const debug = require('debug')('modules:summary');
const util = require('../helpers/util');
const LOG_STYLES = require('../helpers/pretty-log');
const Article = require('./Article')

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
        return summaryForItems(articles, summaryMethod, params)
    })
}


/**
 * Returns a number of sapiObj based on the given article ID's (utilizing directly)
 * @param {*} id - Article ID 
 * @private
 */
function summaryForItems(idArray, summaryMethod, ...params) {
    params = params.pop();
    const itemPromisers = [];
    if (summaryMethod == 'extractive') {
        this.sumMethod = summaryMethod
    }
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
function extractiveSummarization(id, algorithm = 'lex-rank', length = 2) {
    console.log(LOG_STYLES.FG_BLUE,
        `Performing an extractive summary using the ${algorithm} algorithm with a length of ${length}`);

    return Article.fetchItem(id).then(article => {
        const text = striptags(article.content).replace(/(\r\n|\n|\r)/gm, "");
        let command = `sumy ${algorithm} --length=${length} --format=plaintext --text="${text}"`;
        return pythonRunner.runPython(command).then(response => {
            article.summary = response
            article.generateStatistics()
            return article;
        }).catch(error => {
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
    return Article.fetchItem(id).then(article => {
        const content = article.content;
        return promiseParser(content).then(result => {
            if (result == null) {
                article.summary = null;
                return article
            }
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
        if (!paragraph) {
            return article
        }
        article.summary = paragraph.split('.')[0]
        article.generateStatistics()
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
}