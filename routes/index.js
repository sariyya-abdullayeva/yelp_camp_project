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

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    var password = req.body.password;
    User.register(newUser, password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        })
    })
})

// SHOW REGISTER FORM
router.get('/login', function(req, res){
    res.render('login')
})

// hadling SIGN UP LOGIC with middleware 
//router.post('login', middleware, callback function)
router.post('/login',passport.authenticate('local', 
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'

    }),function(req, res){ 
})




// LOG OUT
router.get('/logout', function(req,res){
    req.logout();
    req.flash('error', 'Logged out!')
    res.redirect('/campgrounds')
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


module.exports = router;