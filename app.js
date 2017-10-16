let express = require('express');
let bodyParser = require('body-parser')
let morgan = require('morgan');
let mongoose = require('mongoose')
let methodOverride = require('method-override');
let db = require('./config/database');
let http = require("http").Server(app);
let socket_io = require('socket.io')(http);
let  cors = require('cors');



mongoose.connect(db.database,function(err){
    if(err){
        console.log("connection to database failed")
    }
    else{
    console.log("Connected to database" +  db.database);
}});

let port = 8080;
var app = express();
mongoose.connect()
 
http.listen(port, function(err){
    if(err){
        console.log(err)
    }
    else{
        console.log("app listening on port " + port)
    }
}
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
var api = require("./routes/api")(app, express,socket_io);
app.use("/api", api);
// app.use("/",(req,res) =>{
//     res.sendFile(__dirname + "/index.html")
// })