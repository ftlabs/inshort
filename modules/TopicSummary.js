const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const LOG_STYLES = require('../helpers/pretty-log');
const ArticleSummary = require('./ArticleSummary');
const Article = require('./Article')
const util = require('../helpers/util');
const sentiment = require('./Sentiment')
const Facet = require('../models/Facet');

/**
 * Returns a list of articles for a given topic as well as the top facets / annnotations
 * related to that search
 * @param {*} searchTerm 
 * @param {*} after 
 * @param {*} before 
 */
function summariseTopicForRange(searchTerm, after, before) {
    let afterTime = util.convertDateToSAPI(after)
    let beforeTime = util.convertDateToSAPI(before)
    const maxFacets = 30;
    return fetchContent.searchBetweenRange(afterTime, beforeTime, searchTerm).then(resp => {
        const sapiObj = resp.sapiObj
        const facets = sapiObj.results[0].facets;

        const articles = Article.constructIDArray(sapiObj);
        const response = {
            articles: null,
            commonAnnotations: null,
            facets: extractFacets(facets)
        }
        return Article.fetchItems(articles, Article.fetchItem).then(articleItems => {
            response.articles = articleItems
            response.commonAnnotations = Article.extractTopAnnotations(articleItems, ['SECTION', 'SUBJECT', 'GENRE', 'TOPIC'])
            return response;
        })
    })
}

/**
 * Given a array of facets exracts the facets to a dictionary and sorts them in decending order
 * @param {*} facets 
 * @param {*} facetType 
 */
function extractFacets(facets) {
    let facetsDict = {}
    for(let item of facets) {
        facetsDict[item.name] = item.facetElements.sort(util.dynamicSort('-count'));
    }
    return facetsDict;
}

/**
 * Returns a list of articles for a given topic as well as the top facet items related to that search
 * Also returns article results for each facet
 * @param {*} searchTerm 
 * @param {*} after 
 * @param {*} before 
 */
function summariseTopicsForRangeExpanded(searchTerm, after, before) {
    let afterTime = util.convertDateToSAPI(after)
    let beforeTime = util.convertDateToSAPI(before)
    let params = { maxResults:  3}
    const facetPromises = [];
    return summariseTopicForRange(searchTerm, after, before).then(topics => {
        topics.articles.forEach((item, idx) => {
            item.sentiment = sentiment.sentimentAnalysis(item);
        })
        for(let facet of Object.keys(topics.facets)) { // Each facet type (people, orgs etc.)
            for(const [index, item] of topics.facets[facet].entries()) { //Each of the top results for each facet
                facetPromises.push(() => fetchContent.searchBetweenRange(afterTime, beforeTime, item.name, params) //Lookup these terms
                .then(resp => { 
                    const articleIds = Article.constructIDArray(resp.sapiObj); //Retrieve the articles
                    fetchItems(articleIds).then(articles => {
                        topics.facets[facet][index]['results'] = articles //Append these articles to the facet items object.
                        return topics;  
                    })
                })) 
            }
        }
        return directly(CAPI_CONCURRENCE, facetPromises).then(response => topics)  
    })
}

/**
 * Returns the images for a search term plus date
 * @param {*} searchTerm 
 * @param {*} after 
 * @param {*} before 
 */
function imagesForTopic(searchTerm, after, before) {
    let afterTime = util.convertDateToSAPI(after)
    let beforeTime = util.convertDateToSAPI(before)
    return fetchContent.searchBetweenRange(afterTime, beforeTime, searchTerm).then(resp => {
        const sapiObj = resp.sapiObj
        const articles = ArticleSummary.constructIDArray(sapiObj);
        return fetchItems(articles, fetchItemWithImage).then(articleItems => {
            return articleItems;
        })
    })
}

/**
 * Returns a sapiObj based on the given article ID
 * @param {*} id - Article ID 
 */
function fetchItemWithImage(id) {
    return fetchContent.getContentByID(id).then(article => {
        const articleObj = {
            id: article.sapiObj.id,
            title: article.sapiObj.title,
            standfirst: article.sapiObj.standfirst,
            genre: article.sapiObj.genre,
            firstPublishedDate: article.sapiObj.firstPublishedDate,
            url: article.sapiObj.webUrl,
            byline: article.sapiObj.byline,
        }
        if(article.sapiObj.hasOwnProperty('mainImage')) {
            const imageID = article.sapiObj.mainImage.id.split('/').pop();
            return fetchContent.getContentByID(imageID).then(item => {
                const imgId = item.sapiObj.members[0].id.split('/').pop();   
                return fetchContent.getContentByID(imgId).then(imgItem => {
                    articleObj['imageUrl'] = imgItem.sapiObj.binaryUrl
                    return articleObj;   
                })       
            });
        }
        else {
            return articleObj
        }
    })
}



module.exports = {
    summariseTopicForRange,
    summariseTopicsForRangeExpanded,
    imagesForTopic
}