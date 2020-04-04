var express = require('express');
var router  = express.Router();
var Campground = require("../models/campground");


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
router.post('/',isLoggedIn,function(req, res){
    //get data from FORM 
    var nameNew = req.body.name
    var imageNew = req.body.image
    var descriptionNew = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    //and add to campGround
    var newCampGround = {
        name: nameNew,
        image: imageNew,
        description: descriptionNew,
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
router.get('/new',isLoggedIn ,function(req, res){
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
router.get('/:id/edit', function(req, res){
    Campground.findById(req.params.id, function(err, foundCampGround){
        if(err){
            res.redirect('/campgrounds')
        } else{
            res.render('campgrounds/edit', {campground: foundCampGround});
        }
    })
    
})
//UPDATE CAMPGROUND ROUTE
router.put('/:id', function(req, res){
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        } else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
})
//MIDDLE WARE FUNCTION
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
module.exports = router;