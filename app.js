let express = require('express');
let bodyParser = require('body-parser')
let morgan = require('morgan');
let mongoose = require('mongoose')
let methodOverride = require('method-override');
let db = require('./config/database');
var app = express();
let http = require("http").Server(app);
let socket_io = require('socket.io')(http);
let cors = require('cors');

app.use(cors());
mongoose.connect(db.database,function(err){
    if(err){
        console.log("connection to database failed");
    }
    else{
console.log(" Connected to database " +  db.database);
}});
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"));
//app.use('/scripts', express.static(`${__dirname }/node_modules`))
var api = require("./routes/api")(app, express,socket_io);
app.use("/api", api);
http.listen(port, function(err){
    if(err){
        console.log(err)
    }
    else{
      console.log("app listening on port " + port);
}
});

// app.use("/",(req,res) =>{
//     res.sendFile(__dirname + "/index.html")
// }){