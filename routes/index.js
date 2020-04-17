var express = require('express');
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");



// LANDING PAGE
router.get("/", function(req, res){
    res.render("landing", {currentUser: req.user});
});


//SHOW REGISTER FORM
router.get('/register', function(req, res){
    res.render('register');
})

//Hadling SING UP LOGINC
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    User.register(newUser, password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', "Welcome to Yelpcamp " + user.username);
            res.redirect('/campgrounds');
        })
    })
})

// SHOW LOGIN FORM
router.get('/login', function(req, res){
    res.render('login')
})

// handling LOGIN LOGIC 
router.post('/login',passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'

    }),function(req, res){ 
})


// LOG OUT
router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', 'Logged out!')
    res.redirect('/campgrounds')
})



module.exports = router;