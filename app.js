const express = require('express');

const mongoose = require('mongoose');

const session = require('express-session');

const passport = require('passport')

const flash = require('connect-flash')

const expressValidator = require('express-validator')

const { check, validationResult } = require('express-validator/check');

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

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }))

  app.use(require('connect-flash')());
    app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
})


app.get('/', ensureAuth, (req, res) => {
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

function ensureAuth(req, res, next){
    if(!req.user){
        res.redirect('/users/login')
        req.flash('danger', 'Please log in')
    }else{
        return next()
    }
}


app.use(express.json());

let articles = require('./routes/articles')
app.use('/articles', articles)

let api = require('./routes/api');
app.use('/api', api);

let users = require('./routes/users');
app.use('/users', users);
app.listen(port, () => console.log('Listening on port' + ' ' + `${port}`+ '. Press ctrl C to stop server'));