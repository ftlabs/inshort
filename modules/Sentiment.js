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
function fetchSentimentForArticle(id) {
    return Article.fetchItem(id).then(resp => sentimentForArticle(resp));
}

/**
 * Given an article object, performs sentiment analysis
 * @param {*} article
 * @param {*} extensive - If true, will perform sentiment analysis on the content.
 */
function sentimentForArticle(article, extensive=false) {
    const title = article.title;
    const standfirst = article.standfirst;
    let score;
    if(extensive) {
        score = sentiment(article.content)
    }
    else {
        score = sentiment(`${title} - ${standfirst}`);
    }
    const genre = article.genre
    return {
        title,
        standfirst,
        genre,
        score,
    }
}

/**
 * Returns the overall sentiment for a set of articles
 * @param {*} articles 
 */
function sentimentForArticles(articles) {
    let sentimentTotal = 0;
    for(let article of articles) {
        let articleSentiment = sentimentForArticle(article).score;
        sentimentTotal += articleSentiment.score
    }
    return Math.round(sentimentTotal / articles.length);
}

module.exports = {
    sentimentForArticle,
    sentimentForArticles,
    fetchSentimentForArticle
}