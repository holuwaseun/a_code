let express = require('express');
let bodyParser = require('body-parser')
let morgan = require('morgan');
let mongoose = require('mongoose')
let methodOverride = require('method-override');
let db = require('./config/database');


mongoose.connect(db.database,function(err){
    if(err){
        console.log("connection to database failed")
    }
    console.log("Connected to database")
})

let port = 8080;
var app = express();
mongoose.connect()
 
app.listen(port, function(){
    
        console.log("app listening on port " + port)
    }
);