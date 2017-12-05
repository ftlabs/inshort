const express = require('express');
const router = express.Router();
const Timeline = require('../modules/Timeline');

/**
 * Endpoints for experiments with different summary methodologies, 
 * not meant for production.
 */

 //All summary methods list for a given article ID.

 //

/**
 * First sentence summaries extracted from the content
 */

router.get('/', (req, res, next) => {   
    Timeline.createTimeline(req.query.search, req.query.after, req.query.before).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});




module.exports = router;