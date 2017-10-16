
var express = require("express");
var app = express();
var debug = require("debug")("exp:debug");
var bodyParser = require("body-parser");
var msg = require("./messages/messages");
var authentication = require("./authentication/autentication");
var auth = require("./routes/auth");
var school = require("./routes/school");
var administration = require("./routes/administration");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');//
    res.setHeader('Access-Control-Allow-Origin', '*');//
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use("/sales   ", function(req,res,next){

    if(authentication.isAuth(req.headers.authorization)){
        next();
    }
    else{
        res.send(msg.unauthorized);
    }
});

app.use("/manager", function(req,res,next){

    if(authentication.isAuthNotSales(req.headers.authorization)){
        next();
    }
    else{
        res.send(msg.unauthorized);
    }
});

app.use("/owner", function(req,res,next){
    if(authentication.isAuthOwner(req.headers.authorization ) ){
        next();
    }
    else{
        res.send(msg.unauthorized);
    }
});
app.use("/",auth);
app.use("/",school);
app.use("/",administration);

module.exports = app;


