const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const User = require('../models/user');



router.get('/signup', (req, res)=> {
    res.render('register', {
        title: "SignUp"
    })
})

router.get('/login', (req, res) => {
    res.render('login', {
        title: "Login"
    })
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "You are logged out")
    res.redirect('/users/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
})
router.get('/gettoken', ensureAuth, (req, res) => {
    jwt.sign({user: req.user}, 'secret', (err, token) => {
        res.render('viewtoken', {
            token
        })
    })
})

router.post('/signup', (req, res) => {
    let user = new User();
    let query = {username:req.body.username}

    User.find(query, (err, result) => {
        if(err) throw err
        if(result && result.length >= 1){
            req.flash('danger', 'user with username ' + req.body.username + ' already exists')
            res.redirect('/users/signup')
        }else{
            user.name = req.body.name;
            user.email = req.body.email;
            user.username = req.body.username;
            
            let password = req.body.password
            bcrypt.genSalt(10, (err, salt) => {
                if(err){
                    console.log(err)
                }else{
                    bcrypt.hash(password, salt, (err, hash) =>  {
                        if(err){
                            console.log(err)
                        }else{
                            user.password = hash
                            user.save((err) => {
                                if(err){
                                    console.log(err)
                                }else{
                                    req.flash('success', 'user successfully signed up')
                                    res.redirect("/users/login")
                                }
                            })
                        }
                    })
                }
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

module.exports = router;