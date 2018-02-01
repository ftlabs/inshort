const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const LOG_STYLES = require('../helpers/pretty-log');
const ArticleSummary = require('./ArticleSummary');
const Article = require('./Article')
const util = require('../helpers/util');
const stopwords = require('stopword');

/**
 * Given a list of articles, returns an array of objects in decending order
 * of common word count
 * @param {*} articles - Array of article objects
 * @param {*} count - Amount of words to return
 */
function wordListForArticles(articles, count=30) {
    let wordCount = {}
    for (let article of articles) {
        const words = wordList(article);
        for (let word of words) {
            if(word in wordCount) {
                wordCount[word]++;
            }
            else {
                wordCount[word] = 1;
            }
        }
    }
    let props = Object.keys(wordCount).map(function(key) {
        return { 
            key: key, 
            value: this[key] 
        };
      }, wordCount);
    props.sort((p1, p2) => p2.value - p1.value);
    
    if(props.length > count) {
        props = props.slice(0,count);
    }
    return props
}

/**
 * Retrieves a list of words from an article object with stopwords removed
 * @param {*} article 
 */
function wordList(article) {
    const tokens = article.contentTokens;
    return stopwords.removeStopwords(tokens);
}

module.exports = {
    wordListForArticles,
    wordList
}