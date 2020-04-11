var Campground = require("../models/campground"),
    Comment    =require ("../models/comment");

var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampGround){
            if(err){
                console.log(err);
                res.redirect('back');
            } else{
                if(foundCampGround.author.id.equals(req.user._id)){
                next();
                } else{
                    res.send('Do not have permission')
                }
            } 
        })
    } else {
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership= function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect('back');
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                next();
                } else{
                    res.send('Do not have permission')
                }
            } 
        })
    } else {
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Login First!')
    res.redirect('/login');
};

module.exports = middlewareObj;