const express = require('express');
const router = express.Router();
const Summary = require('../modules/Summary');

<<<<<<< HEAD
router.get('/sentence/:id', (req, res, next) => {
=======
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
>>>>>>> a549831b168ff9946b4bf1d691546caddfbda8ce
        Summary.extractFirstLine(req.params.id).then(articles => {
            res.json(articles);
        }).catch(e => {
            next(e);
    })
});

<<<<<<< HEAD
=======

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

>>>>>>> a549831b168ff9946b4bf1d691546caddfbda8ce
router.get('/extractive/:id', (req, res, next) => {   
    const id = req.params.id;
    Summary.extractiveSummarization(id, algorithm, lines).then(summary => {
        res.json(summary);
    }).catch(e => {
        next(e);
    })
});

<<<<<<< HEAD
router.get('/', (req, res, next) => {   
    Summary.summarysForTimeRange(req.query.after, req.query.before, 
        Summary.extractiveSummarization, 'lsa', 5).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});



=======
/**
 * ----
 */
>>>>>>> a549831b168ff9946b4bf1d691546caddfbda8ce


module.exports = router;