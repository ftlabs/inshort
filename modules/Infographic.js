const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const LOG_STYLES = require('../helpers/pretty-log');
const ArticleSummary = require('./ArticleSummary');
const Article = require('./Article')
const TopicSummary = require('./TopicSummary');
const util = require('../helpers/util');
const sentiment = require('./Sentiment')
const TextAnalysis = require('./TextAnalysis')
const Wikipedia = require('../lib/Wikipedia')

/**
 * Performs a simmiliar summary response to TopicSummary, however appends additional
 * response objects
 * @param {*} searchTerm 
 * @param {*} after 
 * @param {*} before 
 */
function summariseTopicForRange(searchTerm, after, before) {
    return TopicSummary.summariseTopicForRange(searchTerm, after, before).then(response => {
        response.sentiment = sentiment.sentimentForArticles(response.articles);
        response.commonWords = TextAnalysis.wordListForArticles(response.articles);
        return response;
    })
}

function summariseFacet(facet) {
    Wikipedia.fetchSummaryForTitle(facet.name);
}

module.exports = {
    summariseTopicForRange
}