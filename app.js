const express = require('express');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');

let db = mongoose.connection;

const bodyParser = require('body-parser')


const path = require('path')

const app = express();

const port = 3000


let Article = require('./models/article')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

db.once('open', () =>{
    console.log('connected to db')
} )

db.on('error', (err) => {
    console.log(err)
})

app.set('views', path.join(__dirname, 'views'))
app.set( 'view engine', 'pug')


app.post("/articles/add", (req, res) => {
   let article = new Article;
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;

   article.save((err) => {
       if(err){
           console.log(err)
           return
       }else{
           res.redirect('/')
       }
   })
})

app.get('/article/:id', (req, res) => {
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

app.get('/articles/add', (req, res) => {
    res.render('addarticles', {
        title: "Add an Article",
    })
})
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if(err){
            console.log('There is an error:' + err);
        }else{
            res.render('index', {
                title: 'Content',
                articles
            })
        }
       
    })
})
app.listen(port, () => console.log('Listening on port' + ' ' + `${port}`+ '. Press ctrl C to stop server'));