var express    = require("express"),
    app        = express (),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    //authentication==
    passport   = require('passport'),
    LocalStrategy  = require('passport-local'),

    Campground = require("./models/campground"),
    Comment    = require ("./models/comment");
    User       = require('./models/user'),
    seedDB     = require("./seeds");

mongoose.connect("mongodb://localhost:27017¦/yelp_app", {useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
seedDB();

// Passport Configurations
app.use(require('express-session')({
    secret: 'This too obvious',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// <!-- to include header and footer tepmlates to other pages -->
// <!-- <%- include("partials/header") %> -->
// <!-- <%- include("partials/footer") %> -->

// ================= ROUTES GO HERE===================================
//main page
app.get("/", function(req, res){
    res.render("landing");
});


//list of camping grounds
app.get('/campgrounds', function(req, res){
    //get all campgrounds from DB and Render that file
    Campground.find({}, function(err,camps){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/index", {campgrounds:camps})
        }
    })
});


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
//Submiting form that will send a data to post/campgrounds route
app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new');
});

// SHOW ROUTE- to show more info about pix in INDEX page
app.get('/campgrounds/:id', function(req, res){
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

// ====================
// COMMENTS ROUTES
// ====================
app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.render('comments/new', {campground:campground})
        }
    });
});

app.post('/campgrounds/:id/comments', function(req,res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id)
                }
            });
        }
    });
});

//Auth ROUTES

//show register form
app.get('/register', function(req, res){
    res.render('register');
})

app.post('/register', function(req, res){
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
// show log in form
app.get('/login', function(req, res){
    res.render('login')
})



app.listen(3000, function(){
    console.log("yelp_camp app started" );
})