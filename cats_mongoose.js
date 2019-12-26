var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", {useNewUrlParser: true, useUnifiedTopology: true });

var catSchema = new mongoose.Schema({
    name: String,
    age: Number
})

var Cat = mongoose.model("Cat", catSchema); 
//============================================Adding to DB=====================
// var sesi = new Cat ({
//     name: 'Nurlan',
//     age: 13
// });

// sesi.save(function(err, cat){
//     if(err){
//         console.log('Sth wrong!')
//     } else{
//         console.log('cat daved')
//         console.log(cat);
//     }
// });

Cat.create({
    name:'Efe',
    age:0.7
}, function(err, cat){
    if(err){
        console.log(err)
    }else{
        console.log('Cat here');
        console.log(cat);
    }
})
//====================================Retriving from DB==========================

// Cat.find({}, function(err, cats){
//     if(err){
//         console.log('OH NO!');
//         console.log(err);
//     }else{
//         console.log('here Cats');
//         console.log(cats);
//     }
// });