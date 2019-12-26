var express    = require("express")
var app        = express ();
//to make post requests
var bodyParser = require("body-parser");
//For DB
var mongoose   = require("mongoose");



//tell express use ejs as a style for page adresses
app.set("view engine", "ejs");

//tell express to use body-parser
app.use(bodyParser.urlencoded({extended:true}));

//Connect DB to Express
mongoose.connect("mongodb://localhost:27017/yelp_app", {useNewUrlParser: true, useUnifiedTopology: true });

//to include header and footer tepmlates to other pages
// <%- include("partials/header") %>
// <%- include("partials/footer") %>


//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

var Campground = mongoose.model('Campground', campgroundSchema);
// Campground.create(
//     {
//         name:'Sarema Island', 
//         image:'https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
//         description: 'This is a magical Baltic island that is infused with Estonian magical soul'
//     }, function(err, camp){
//         if(err){
//             console.log(err)
//         }else{
//             console.log("OKAY")
//             console.log(camp)
//         }
//     }

// )



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


// creating a new campGround
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

//   Create new campground and save to db; 
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
//submiting form that will send a data to post/campgrounds route
app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs');
});

// SHOW ROUTE- to show more info about pix in INDEX page
app.get('/campgrounds/:id', function(req, res){
    //find campground with the id
    var campId = req.params.id
    
    Campground.findById(campId, function(err, foundCampGround){
      if(err){
          console.log(err)
      }else{
        //render show template with that campground
        res.render('show', {campground:foundCampGround})
      }
  })
});











app.listen(3000, function(){
    console.log("yelp_camp app started" );
});