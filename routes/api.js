const express = require('express');

const router = express.Router();

const Article = require('../models/article');

router.get('/articles', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) return res.status(400).send('Bad request');

        res.status(200).send(articles)
    })
})

router.get('/articles/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return res.status(404).send('Not found');

        res.status(200).send(article)
    })
})

router.delet


module.exports = router