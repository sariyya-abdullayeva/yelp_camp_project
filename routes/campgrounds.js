var express = require('express');
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require('../middleware')


//INDEX - show all campgrounds
router.get('/', function(req, res){
    //get all campgrounds from DB and Render that file
    Campground.find({}, function(err,camps){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds:camps, currentUser: req.user});
        }
    })
});


//CREATE - add new campground to DB
router.post('/',middleware.isLoggedIn,function(req, res){
    //get data from FORM 
    var nameNew = req.body.name
    var imageNew = req.body.image
    var descriptionNew = req.body.description
    var price   = req.body.price
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    //and add to campGround
    var newCampGround = {
        name: nameNew,
        image: imageNew,
        description: descriptionNew,
        price: price,
        author: author
    };

    //Create new campground and save to db; 
    Campground.create(newCampGround, function(err, newCamp){
        if(err){
            console.log(err)
        }else{
            // redirect to campgrounds page
            res.redirect('/campgrounds');
        }
    });   
});


//NEW ROUTE- SHOULD BE PLACED BEFORE SHOW ROUTER(/:id)
//Submiting form that will send a data to post/campgrounds route.Show form to create new campground
router.get('/new',middleware.isLoggedIn ,function(req, res){
    res.render('campgrounds/new');
});


// SHOW ROUTE- to show more info about one campground
router.get('/:id', function(req, res){
    //find campground with the id
    var campId = req.params.id
    
    Campground.findById(campId).populate("comments").exec(function(err, foundCampGround){
      if(err){
          console.log(err)
      }else{
        //render show template with that campground
        res.render('campgrounds/show', {campground:foundCampGround})
      }
  });
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit',middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampGround){
            res.render('campgrounds/edit', {campground: foundCampGround});
        });
});


//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds')
    
        } else{
            res.redirect('/campgrounds/'+ req.params.id);
           
        }
    })
})


//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds')
        } else{
            res.redirect('/campgrounds')
        }
    })
})





module.exports = router;