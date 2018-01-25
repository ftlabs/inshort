const express = require('express');
const router = express.Router();
const Sentiment = require('../modules/Sentiment');



router.get('/:id', (req, res, next) => {   
    Sentiment.fetchSentimentForArticle(req.params.id).then(score => {
        res.json(score);
    }).catch(e => {
        next(e);
    })
});


module.exports = router;