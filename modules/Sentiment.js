const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const LOG_STYLES = require('../helpers/pretty-log');
const ArticleSummary = require('./ArticleSummary');
const sentiment = require('sentiment');

/**
 * Module for performing Basic token sentiment analysis using the AFINN-165 wordlist
 */

/**
 * Given an article ID, performs sentiment analysis on the title + standfirst, 
 * returning a score object
 * @param {*} id 
 */
function sentimentForArticle(id) {
    return ArticleSummary.fetchItem(id).then(resp => {
        const title = resp.title;
        const standfirst = resp.standfirst;
        const score = sentiment(`${title} - ${standfirst}`);
        const emoji = score == 0 ? '😐' : (score > 0 ? '😀' : '😟');
        return {
            title,
            standfirst,
            score,
            emoji
        }
    })
}

module.exports = {
    sentimentForArticle
}