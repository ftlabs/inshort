const express = require('express');
const router = express.Router();
const Infographic = require('../modules/Infographic');

router.get('/', (req, res, next) => {
    res.setHeader('Cache-Control', `private, max-age=900`)      
    Infographic.summariseTopicForRange(req.query.search, req.query.after, req.query.before).then(articleSummarys => {
        res.json(articleSummarys);
    }).catch(e => {
        next(e);
    })
});



module.exports = router;
