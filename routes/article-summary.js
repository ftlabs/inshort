const express = require('express');
const router = express.Router();
const ArticleSummary = require('../modules/ArticleSummary');

/**
 * Endpoints for experiments with different ArticleSummary methodologies, 
 * not meant for production.
 */

 //All ArticleSummary methods list for a given article ID.

 //

/**
 * First sentence summaries extracted from the content
 */

router.get('/range/first-sentence', (req, res, next) => {   
    const algorithm = req.query.algorithm
    const lines = req.query.lines
    ArticleSummary.ArticleSummarysForTimeRange(req.query.after, req.query.before, 
        ArticleSummary.extractFirstLine).then(articleArticleSummarys => {
        res.json(articleArticleSummarys);
    }).catch(e => {
        next(e);
    })
});

router.get('/first-sentence/:id', (req, res, next) => {
        ArticleSummary.extractFirstLine(req.params.id).then(articles => {
            res.json(articles);
        }).catch(e => {
            next(e);
    })
});


/**
 * Extractive ArticleSummarys
 */

router.get('/range/extractive', (req, res, next) => {   
    const algorithm = req.query.algorithm
    const lines = req.query.lines
    ArticleSummary.ArticleSummarysForTimeRange(req.query.after, req.query.before, 
        ArticleSummary.extractiveSummarization, algorithm, lines).then(articleArticleSummarys => {
        res.json(articleArticleSummarys);
    }).catch(e => {
        next(e);
    })
});

router.get('/extractive/:id', (req, res, next) => {   
    const id = req.params.id;
    const algorithm = req.query.algorithm
    const lines = req.query.lines
    ArticleSummary.extractiveSummarization(id, algorithm, lines).then(ArticleSummary => {
        res.json(ArticleSummary);
    }).catch(e => {
        next(e);
    })
});

/**
 * ----
 */

//Display all ArticleSummarys
router.get('/:id', (req, res, next) => {   
    const id = req.params.id;
    ArticleSummary.extractAllSummarys(id).then(summaries => {
        res.json(summaries);
    }).catch(e => {
        next(e);
    })
});


module.exports = router;