const express = require('express');
const router = express.Router();
const Summary = require('../modules/Summary');

/**
 * Endpoints for experiments with different summary methodologies, 
 * not meant for production.
 */


/**
 * First sentence summaries extracted from the content
 */

router.get('/range/first-sentence', (req, res, next) => {   
    const algorithm = req.query.algorithm
    const lines = req.query.lines
    Summary.summarysForTimeRange(req.query.after, req.query.before, 
        Summary.extractFirstLine).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});

router.get('/first-sentence/:id', (req, res, next) => {
        Summary.extractFirstLine(req.params.id).then(articles => {
            res.json(articles);
        }).catch(e => {
            next(e);
    })
});


/**
 * Extractive summarys
 */

router.get('/range/extractive', (req, res, next) => {   
    const algorithm = req.query.algorithm
    const lines = req.query.lines
    Summary.summarysForTimeRange(req.query.after, req.query.before, 
        Summary.extractiveSummarization, algorithm, lines).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});

router.get('/extractive/:id', (req, res, next) => {   
    const id = req.params.id;
    Summary.extractiveSummarization(id, algorithm, lines).then(summary => {
        res.json(summary);
    }).catch(e => {
        next(e);
    })
});

/**
 * ----
 */


module.exports = router;