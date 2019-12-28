var express    = require("express"),
    app        = express (),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds");

// seedDB();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017¦/yelp_app", {useNewUrlParser: true, useUnifiedTopology: true });

//to include header and footer tepmlates to other pages
// <%- include("partials/header") %>
// <%- include("partials/footer") %>


// ================= ROUTES GO HERE===================================
//main page
app.get("/", function(req, res){
    res.render("landing");
})


//list of camping grounds
app.get('/campgrounds', function(req, res){
    //get all campgrounds from DB and Render that file
    Campground.find({}, function(err,camps){
        if(err){
            console.log(err)
        }else{
            res.render("index", {campgrounds:camps})
        }
    })
    
})


//Creating a new campGround
app.post('/campgrounds', function(req, res){
    //get data from FORM 
    var nameNew = req.body.name
    var imageNew = req.body.image
    var descriptionNew = req.body.description

    
    //and add to campGround
    var newCampGround = {
        name: nameNew,
        image: imageNew,
        description: descriptionNew
    };

    console.log(newCampGround);

//Create new campground and save to db; 
    Campground.create(newCampGround, function(err, newCamp){
        if(err){
            console.log(err)
        }else{
            // redirect to campgrounds page
            res.redirect('/campgrounds');
        }
    })   
});


//NEW ROUTE- SHOULD BE PLACED BEFORE SHOW ROUTER(/:id)
//Submiting form that will send a data to post/campgrounds route
app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs');
});

// SHOW ROUTE- to show more info about pix in INDEX page
app.get('/campgrounds/:id', function(req, res){
    //find campground with the id
    var campId = req.params.id
    
    Campground.findById(campId).populate("comments").exec(function(err, foundCampGround){
      if(err){
          console.log(err)
      }else{
        console.log(foundCampGround);
        //render show template with that campground
        res.render('show', {campground:foundCampGround})
      }
  })
});











app.listen(3000, function(){
    console.log("yelp_camp app started" );
});