let express = require('express');
let bodyParser = require('body-parser')
let morgan = require('morgan');
let mongoose = require('mongoose')

let port = 8000;
var app = express();
mongoose.connect()
 
app.listen(port, function(err){
    if(err){
        console.log("could not connect to port")
    }
    else{
        console.log("app listening on " + port )
    }
});