const express = require('express');
const router = express.Router();
const Article = require('../modules/Article');

router.get('/search/:searchTerm', (req, res, next) => {
        Article.searchByTerm(req.params.searchTerm).then(articles => {
            res.json(articles);
        }).catch(e => {
            next(e);
    })
});

module.exports = router;