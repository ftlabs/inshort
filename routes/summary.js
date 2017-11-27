const express = require('express');
const router = express.Router();
const Summary = require('../modules/Summary');

router.get('/sentence/:id', (req, res, next) => {
        Summary.extractFirstLine(req.params.id).then(articles => {
            res.json(articles);
        }).catch(e => {
            next(e);
    })
});

router.get('/extractive/:id', (req, res, next) => {   
    const id = req.params.id;
    const algorithm = req.query.algorithm
    const lines = req.query.lines
    Summary.extractiveSummarization(id, algorithm, lines).then(summary => {
        res.json(summary);
    }).catch(e => {
        next(e);
    })
});



router.get('/', (req, res, next) => {   
    Summary.summarysForTimeRange(req.query.after, req.query.before).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});





module.exports = router;