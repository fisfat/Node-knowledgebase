const express = require('express');

const router = express.Router();

const passport = require('passport')

const bcrypt = require('bcryptjs')

const Joi = require('joi')

const jwt = require('jsonwebtoken')

const Article = require('../models/article');

const User = require('../models/user')


router.get('/articles',verifyToken, (req, res) => {
        jwt.verify(req.auth, 'secret', (err, data) => {
            if(err) return res.status(403).send('forbidden')
        
        Article.find({}, (err, articles) => {
            if(err) return res.status(400).send('Bad request');

            res.status(200).send({articles, data})
        })
    })
})

router.get('/articles/:id',verifyToken, (req, res) => {
    jwt.verify(req.auth, 'secret', (err) => {
        if(err) return res.status(403).send('forbidden')
    
    Article.findById(req.params.id, (err, article) => {
        if (err) return res.status(404).send('Not found');
        res.status(200).send(article)
    })
    })
})

router.delete('/articles/delete/:id',verifyToken, (req, res) => {
    jwt.verify(req.auth, 'secret', (err) => {
        if(err) return res.status(403).send(forbidden)
    
    Article.findByIdAndDelete(req.params.id, (err) => {
        if (err) return res.status(400).send('bad request')

        return res.status(200).send('Deleted');
    })
    })
})

router.put('/articles/edit/:id', verifyToken, (req, res) => {
            jwt.verify(req.auth, 'secret', (err, data) => {
                if(err) return res.status(403).send('forbidden')

                const schema = {
                    title: Joi.string().required(),
                    //author: Joi.string().required(),
                    body: Joi.string().required(),
                }

                const {error, value} = Joi.validate(req.body, schema)
                
                if (error) return res.status(403).send(error.details[0].message);
                const query = {_id:req.params.id}

                const articleEdit = {}
                articleEdit.title = req.body.title
                articleEdit.author = data.user._id;
                articleEdit.body = req.body.body

                Article.update(query, articleEdit, (err) => {
                    if (err) return res.status(401).send('Bad request')

                    res.status(200).send({status: 'success', articleEdit})
                })
            })       
})

router.post('/signup', (req, res) => {
    let user = new User();
    let query = {username:req.body.username}

    User.find(query, (err, result) => {
        if(err) throw err
        if(result && result.length >= 1){
            res.status(400).send('user with username ' + req.body.username + ' already exists')
        }else{
            user.name = req.body.name;
            user.email = req.body.email;
            user.username = req.body.username;
            
            let password = req.body.password
            bcrypt.genSalt(10, (err, salt) => {
                if(err){
                    res.send('An error occured')
                }else{
                    bcrypt.hash(password, salt, (err, hash) =>  {
                        if(err){
                            res.send('An error occured')
                        }else{
                            user.password = hash
                            user.save((err) => {
                                if(err){
                                    res.send('An error occured')
                                }else{
                                    res.send('user successfully signed up')
                                }
                            })
                        }
                    })
                }
            })
        }
    })   
})


router.post('/articles/add', verifyToken,  (req, res) => {
    jwt.verify(req.auth, 'secret', (err, data) => {
        if (err) {
            res.status(403).send('verification error')
        }else{
            const schema = {
                title: Joi.string().required(),
                //author: Joi.string().required(),
                body: Joi.string().required(),
            }
        
            const {error, value} = Joi.validate(req.body, schema)
            
            if (error) return res.status(403).send(error.details[0].message);
        
            const newArticle = new Article();
            newArticle.title = req.body.title;
            newArticle.author = data.user._id;
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