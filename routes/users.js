const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

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

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next)
})


router.post('/signup', (req, res) => {
    let user = new User();
    
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
                            res.redirect("/login")
                        }
                    })
                }
            })
        }
    })
})

module.exports = router;