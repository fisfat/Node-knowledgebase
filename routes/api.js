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


router.post('/articles/add', verifyToken,  (req, res) => {
    jwt.verify(req.auth, 'secret', (err) => {
        if (err) {
            res.status(403).send('verification error')
        }else{
            const schema = {
                title: Joi.string().required(),
                author: Joi.string().required(),
                body: Joi.string().required(),
            }
        
            const {error, value} = Joi.validate(req.body, schema)
            
            if (error) return res.status(403).send(error.details[0].message);
        
            const newArticle = new Article();
            newArticle.title = req.body.title;
            newArticle.author = req.body.author;
            newArticle.body = req.body.body;
        
            newArticle.save((err) => {
                if (err) return res.status(400).send('Bad Request')
                return res.status(200).send({status: 'Success', newArticle})
            }) 
        }  
    })
})


function verifyToken(req, res, next){
    const auth = req.headers['authentication'];
    if(typeof auth !== 'undefined' || null || ''){
        req.auth = auth;
        next();
    }else{
        res.status(403).send('Authentication is missing')
    }    
}


module.exports = router