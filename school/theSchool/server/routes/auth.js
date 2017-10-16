//expoeres withe express
var express = require("express");
var router = express.Router();
var auth = require("../authentication/autentication");
var con = require('../db/sql');
var squel = require("squel");

router.post("/login",function(req,res,next){
    var userName = req.body.userName != null ? req.body.userName : null;
    var password = req.body.password != null ? req.body.password : null;
    if(userName == null || userName == "" || password == null || password == ""){
       return res.send("user name or password missing");
    }
    var insertQuery = squel.select()
        .from("administration")
        .field("administration.role")
        .field("administration.name")
        .field("administration.image")
        .where("administration.user_name=?",userName)
        .where("administration.password=?",password)
        .toString();
        con.query(insertQuery, function (err, rows) {
            if (err) {
                console.log("err: ", err);
            }
            else if (rows.length != 0) {
                var role = rows[0].role;
                var name = rows[0].name;
                var image = rows[0].image;
                var session = auth.addAuth(role);
                var date = new Date();
                var response = new Response("user authenticated!",role,session,date,name,image);
                res.send(response);
            }
            else {
                res.send("you are not register!");
            }
        });
});

router.post("/logout",function(req,res,next){
    var key = req.headers.authorization;
    auth.removeAuth(key);
    res.send("logout");
});

var Response = function(msg,role,key,expDate,name,image){
    this.message = msg;
    this.role = role;
    this.key = key;
    this.expDate = expDate;
    this.name = name;
    this.image = image;
};

module.exports = router;
