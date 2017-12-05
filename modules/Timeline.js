const fetchContent = require('../lib/fetchContent');
const directly = require('../helpers/directly'); 
const CAPI_CONCURRENCE = (process.env.hasOwnProperty('CAPI_CONCURRENCE'))? process.env.CAPI_CONCURRENCE : 4;
const LOG_STYLES = require('../helpers/pretty-log');
const ArticleSummary = require('./ArticleSummary');
const util = require('../helpers/util');


/**
 * Returns a JSON object representation of a timeline for a given topic.
 * @param {*} after 
 * @param {*} before 
 * @param {*} ArticleSummaryMethod 
 * @param {*} params 
 */
function createTimeline(searchTerm, after, before, summaryMethod=ArticleSummary.extractFirstLine) {
    const timeline = {
        title: createTitle(after,before),
        events: []
    };
    return ArticleSummary.articlesForSearchTerm(searchTerm, after, before, summaryMethod).then(articles => {
        for (let article of articles) {
            timeline.events.push(createEvent(article));
        }
        return timeline;
    })
}

/**
 * Creates the title element of the timeline
 * @param {*} after 
 * @param {*} before 
 */
function createTitle(after, before) {
    return {
        media: {
            url: "http://via.placeholder.com/250x250?text=Article%20placeholder",
            caption: "Placeholder",
            credit: "Placeholder"
          },
          text: {
            headline: `Timeline for ${after} - ${before}`,
            text: "<p></p>"
          }
    }
}

/**
 * Returns a JSON event object from a given article
 * @param {*} article 
 */
function createEvent(article) {
    const startDate = new Date(article.firstPublishedDate)
    return {
        media: {
            url: 'http://via.placeholder.com/250x250?text=Article%20placeholder',
            caption: 'Placeholder',
            credit: 'Placeholder'
        },
        start_date: {
            month: startDate.getMonth(),
            day: startDate.getDay(),
            year: startDate.getFullYear()
        },
        text: {
            headline: article.title,
            text: article.summary
        }
    }
}

module.exports = {
    createTimeline
}