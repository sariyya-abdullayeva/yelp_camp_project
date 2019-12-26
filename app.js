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
mongoose.connect("mongodb://localhost/yelp_app", {useNewUrlParser: true, useUnifiedTopology: true });

//to include header and footer tepmlates to other pages
// <%- include("partials/header") %>
// <%- include("partials/footer") %>


//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})

var Campground = mongoose.model('Campground', campgroundSchema);
// Campground.create(
//     {
//         name:'Sarema Island', 
//         image:'https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    
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
            res.render("campgrounds", {campgrounds:camps})
        }
    })
    
})


// creating a new campGround
app.post('/campgrounds', function(req, res){
    //get data from FORM 
    var name = req.body.name
    var image = req.body.image
    
    //and add to campGround
    var newCampGround = {
        name: name,
        image: image
    };

    campGrounds.push(newCampGround);

    // redirect to campgrounds page
    res.redirect('/campgrounds');
})


//submiting form that will send a data to post/campgrounds route
app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs');
});













app.listen(3000, function(){
    console.log("yelp_camp app started" );
});