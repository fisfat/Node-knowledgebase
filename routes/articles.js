const express = require('express')

const router = express.Router()

const Article = require('../models/article')

router.post("/add", (req, res) => {
    let article = new Article;
    article.title = req.body.title;
    article.author = req.body.author;
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
 
 
 router.post('/edit/:id',  (req, res) => {
     let article = {};
     article.title = req.body.title;
     article.author = req.body.author;
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
 router.get('/add', (req, res) => {
     res.render('addarticles', {
         title: "Add an Article",
     })
 })

 router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) =>{
        if(err){
            console.log(err)
        }else{
            res.render('article', {
                article
            })
        }
    })
})

 module.exports = router;