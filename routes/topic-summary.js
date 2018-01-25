const express = require('express');
const router = express.Router();
const TopicSummary = require('../modules/TopicSummary');
const Wikipedia = require('../lib/Wikipedia');
/**
 * Endpoints for experiments with different summary methodologies, 
 * not meant for production.
 */

 /**
 * Retrieves top orgs, people and topics and associated articles for those topics along with article results for a given time range.
 */
router.get('/expanded', (req, res, next) => {
    res.setHeader('Cache-Control', `private, max-age=900`)  
    TopicSummary.summariseTopicsForRangeExpanded(req.query.search, req.query.after, req.query.before).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});


/**
 * Retrieves top orgs, people and topics and associated articles for those topics along with article results for a given time range.
 */
router.get('/wikipedia', (req, res, next) => {
    res.setHeader('Cache-Control', `private, max-age=900`)  
    Wikipedia.fetchSummaryForTitle(req.query.search).then(summary => {
        res.json(summary);
    }).catch(e => {
        next(e);
    })
});


// router.get('/images', (req, res, next) => {   
//     TopicSummary.imagesForTopic(req.query.search, req.query.after, req.query.before).then(articleSummarys => {
//         res.json(articleSummarys);
//     }).catch(e => {
//         next(e);
//     })
// });


/**
 * Retrieves top orgs, people and topics along with article results for a given time range.
 */
router.get('/', (req, res, next) => {   
    res.setHeader('Cache-Control', `private, max-age=900`)      
    TopicSummary.summariseTopicForRange(req.query.search, req.query.after, req.query.before).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});





module.exports = router;