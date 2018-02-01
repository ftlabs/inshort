const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly');
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE')) ? process.env.CAPI_CONCURRENCE : 4;
const promiseParser = require('../helpers/xml2js-promise');
const striptags = require('striptags');
const pythonRunner = require('../helpers/python-runner');
const debug = require('debug')('modules:summary');
const util = require('../helpers/util');
const LOG_STYLES = require('../helpers/pretty-log');
const ArticleObject = require('../models/Article')


/**
 * Returns a number of sapiObj based on the given article ID's (utilizing directly)
 * @param {*} id - Article ID 
 * @private
 */
function fetchItems(idArray) {
    const itemPromisers = [];
    for (let id of idArray) {
        itemPromisers.push(() => fetchItem(id))
    }
    return directly(CAPI_CONCURRENCE, itemPromisers);
}


/**
 * Returns a sapiObj based on the given article ID
 * @param {*} id - Article ID 
 */
function fetchItem(id) {
    return fetchContent.getContentByID(id).then(article => {
        const articleObj = new ArticleObject(
            article.sapiObj.id,
            article.sapiObj.title,
            article.sapiObj.standfirst,
            article.sapiObj.genre,
            article.sapiObj.firstPublishedDate,
            article.sapiObj.webUrl,
            article.sapiObj.byline,
            article.sapiObj.type,
            article.sapiObj.annotations,
            striptags(article.sapiObj.bodyXML, ["p", "body"]), 
        )
        if(article.sapiObj.hasOwnProperty('mainImage')) {
            articleObj.imageUrl = article.sapiObj.mainImage.members[0].binaryUrl
        }
        return articleObj
    }).catch(error => {
        console.log(error);
        console.log(`Unable to parse or retrieve item with id: ${id}`)
        return;
    })
}

/**
 * Expands annotations (performs CAPI lookups) and appends them to the articleObj
 * @param {*} id 
 */
function fetchItemEnrichedContent(id) {
    const annotationPromises = [];
    return fetchItem(id).then(articleObj => {
        const annotations = []
        for(let annotation of articleObj.annotations) {
            annotationPromises.push(() => fetchContent.getContentByApiUrl(annotation.apiUrl))
        }
        return directly(CAPI_CONCURRENCE, annotationPromises).then(annotationDetails => {
            articleObj.annotations = annotationDetails;
            return articleObj;
        });
    })
}


/**
 * Given a SapiObj, returns an array of article ID's
 */
function constructIDArray(sapiObj) {
    const articles = [];
    const results = sapiObj.results;
    if (results.length > 0 && results[0].hasOwnProperty('results')) {
        for (let article of sapiObj.results[0].results) {
            articles.push(article.id);
        }
    }
    return articles;
}

/**
 * Extracts the top annotations (sorted by mentions) from a list of articles
 * @param {*} articleList - list of article objects (created by fetchItem)
 * @param {*} typeFilter - A list of types to exclude
 * Types:  ORGANISATIONS, SECTION, PERSON, BRAND, LOCATION, TOPIC
 */
function extractTopAnnotations(articleList, typeFilter = null) {
    let facetMap = {};

    for (let article of articleList) {
        if(article == undefined || !article.hasOwnProperty('annotations')) continue;

        AnnotationsLoop:
            for (let annotation of article.annotations) {
                const name = annotation.prefLabel
                if(typeFilter && (typeFilter.includes(annotation.type))) {
                    continue AnnotationsLoop;
                } 
                if(!(name in facetMap)) {
                    facetMap[name] = 1;
                }
                else {
                    facetMap[name]++;
                }
            }
    }
    const keys = []; for(let key in facetMap) keys.push(key);
    let sorted = keys.sort(function(a,b){return facetMap[b]-facetMap[a]});
    return sorted;
}

module.exports = {
    fetchItems,
    fetchItem,
    fetchItemEnrichedContent,
    constructIDArray,
    extractTopAnnotations
}