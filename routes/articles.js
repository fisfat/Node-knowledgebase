const express = require('express')

const router = express.Router()

const Article = require('../models/article')

const User = require('../models/user')

router.post("/add", (req, res) => {
    let article = new Article;
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;
 
    article.save((err) => {
        if(err){
            console.log(err)
            return
        }else{
            req.flash('success', 'Article submitted')
            res.redirect('/')
        }
    })
 })
 
 
 
 router.get('/edit/:id', (req, res) => {
     Article.findById(req.params.id, (err, article) => {
             if(err){
               console.log(err)  
             }else{
                 res.render('edit', {
                     title: "Edit",
                     article
                 })
             }
         })
     })   
 
 
 router.post('/edit/:id', ensureMine,  (req, res) => {
     let article = {};
     article.title = req.body.title;
     article.author = req.user._id;
     article.body = req.body.body;
     let query = {_id:req.params.id}
     Article.update(query, article, (err) => {
         if(err){
             console.log(err)
             return
         }else{
             req.flash('success', 'Article updated')
             res.redirect('/')
         }
     })
 
 })
 
 router.delete('/:id', (req, res) =>{
     let query = {_id: req.params.id}
 
     Article.remove(query, (err) => {
         if(err){
             console.log(err)
         } 
         res.send('success')
     })
 })
 router.get('/add', ensureAuth, (req, res) => {
     res.render('addarticles', {
         title: "Add an Article",
     })
 })

 router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) =>{
        User.findById(article.author, (err, articleUser) => {
            if(err){
                console.log(err)
            }else{
                res.render('article', {
                    article,
                    articleUser
                })
            }
        })
        
    })
})

function ensureAuth(req, res, next){
    if(!req.user){
        res.redirect('/users/login')
        req.flash('danger', 'Please log in')
    }else{
        return next()
    }
}

function ensureMine(req, res, next){
    if(req.user._id == articles.author){
        return next();
    }else{
        req.flash('error', 'insufficient permisions')
        res.redirect('/')
    }
}

 module.exports = router;