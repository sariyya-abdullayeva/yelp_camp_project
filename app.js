var express = require("express")
var app= express ();

app.set("view engine", "ejs");

// <%- include("partials/header") %>
// <%- include("partials/footer") %>

app.get("/", function(req, res){
    res.render("landing");
})

app.get('/campgrounds', function(req, res){
    var campGrounds = [
        {name:'Salmon Creek', image:'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=649&q=80'},
        {name:'Sarema Island', image:'https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'},
        {name:'Setoma Village', image:'https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'}
    ]
    res.render("campgrounds", {campgrounds:campGrounds})
})















app.listen(3000, function(){
    console.log("yelp_camp app started", );
});