const express = require('express');

const router = express.Router();

const passport = require('passport')

const Joi = require('joi')

const jwt = require('jsonwebtoken')

const Article = require('../models/article');




router.get('/articles', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err) return res.status(400).send('Bad request');

        res.status(200).send(articles)
    })
})

router.get('/login', (req, res) => {
    res.render('apiLogin')
})

router.get('/articles/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) return res.status(404).send('Not found');

        res.status(200).send(article)
    })
})

router.delete('/articles/delete/:id', (req, res) => {
    Article.findByIdAndDelete(req.params.id, (err) => {
        if (err) return res.status(400).send('bad request')

        return res.status(200).send('Deleted');
    })
})

router.post('/articles/add',  (req, res) => {

    const schema = {
        title: Joi.string().required(),
        author: Joi.string().required(),
        body: Joi.string().required(),
    }

    const {error, value} = Joi.validate(req.body, schema)
    //res.send(result.error);
    

    if (error) return res.status(403).send(error.details[0].message);

    const newArticle = new Article();
    newArticle.title = req.body.title;
    newArticle.author = req.body.author;
    newArticle.body = req.body.body;

    newArticle.save((err) => {
        if (err) return res.status(400).send('Bad Request')

        return res.status(200).send({status: 'Success', newArticle})
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: res.status(404).send('User not found'),
        failureFlash: true
    })(req, res, next)

})


// function joiValidation(data){
//     const schema = {
//         title: Joi.string().min(1),
//         author: Joi.string().min(1),
//         body: Joi.string().min(1),
//     }

//     return Joi.validate(data, schema);
// }

module.exports = router