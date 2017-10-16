//expoeres withe express
var express = require("express");
var router = express.Router();
var fs = require("fs");
var msg = require("../messages/messages");
var con = require('../db/sql');
var async = require("async");
var squel = require("squel")
var multer  = require('multer');
var pathForUploadFolder = '';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathForUploadFolder)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname);
    }
});
var upload = multer({ storage: storage }).single("file");

router.get('/manager/getAdmins', function (req, res,next) {
    con.query(squel.select()
        .from("administration")
        .field("administration.id")
        .field("administration.name")
        .field("administration.phone")
        .field("administration.email")
        .field("administration.role")
        .field("administration.image")
        .where("administration.role !=?","owner")
        .toString(),function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send(rows);
        }});
});

router.get('/owner/getAdmins', function (req, res,next) {
    con.query(squel.select()
        .from("administration")
        .field("administration.id")
        .field("administration.name")
        .field("administration.phone")
        .field("administration.email")
        .field("administration.role")
        .field("administration.image")
        .field("administration.user_name","userName")
        .field("administration.password")
        .toString(),function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send(rows);
        }});
});

router.post('/owner/deleteAdmin', function (req, res) {
    var admin = req.body;
    var filePath = "./../angularjs/"+admin.image;
    fs.unlinkSync(filePath);
    var insertQuery = squel.delete()
        .from("administration")
        .where("id=?",admin.id)
        .toString();
    con.query(insertQuery,function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send({rows: rows});
        }});
});

router.post('/owner/updateAdmin', function (req, res) {
    var admin = req.body;
    var name = admin.name != null ? admin.name : null;
    var phone = admin.phone != null ? admin.phone : null;
    var email = admin.email != null ? admin.email : null;
    var role = admin.role != null ? admin.role : null;
    var userName = admin.userName != null ? admin.userName : null;
    var password = admin.password!= null ? admin.password : null;
    var image = admin.image != null ? admin.image : null;
    if (name == null || name == "" || phone == null || phone == "" || email == null || email == ""
        || role == null || role == "" || userName == null || userName == ""
        || password == null || password == "" || image == null || image == "") {
        return res.send(msg.fieldMissing);
    }
    var insertQuery = squel.update()
        .table("administration")
        .set("name",  admin.name)
        .set("phone", admin.phone)
        .set("email", admin.email)
        .set("role", admin.role)
        .set("user_name", admin.userName)
        .set("password", admin.password)
        .set("image", admin.image)
        .where("id =?",admin.id)
        .toString();
    con.query(insertQuery,function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send({rows: rows});
        }});
});

router.post('/manager/updateAdmin', function (req, res) {
    var admin = req.body;
    var name = admin.name != null ? admin.name : null;
    var phone = admin.phone != null ? admin.phone : null;
    var email = admin.email != null ? admin.email : null;
    var image = admin.image != null ? admin.image : null;
    if (name == null || name == "" || phone == null || phone == "" ||
        email == null || email == "" || image == null || image == "") {
        return res.send(msg.fieldMissing);
    }
    var insertQuery = squel.update()
        .table("administration")
        .set("name",  admin.name)
        .set("phone", admin.phone)
        .set("email", admin.email)
        .set("image", admin.image)
        .where("id =?",admin.id)
        .toString();
    con.query(insertQuery,function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send({rows: rows});
        }});
});

router.post('/manager/uploadFileAdmin', function (req, res) {
    pathForUploadFolder = './../angularjs/upload/managers';
    upload(req,res,function (err){
        if(err){
            return res.end("err in upload")
        }
        var path = "upload/managers/"+ req.file.filename;
        res.send({path:path})
    })
});

router.post('/owner/addAdmin', function (req, res) {
    pathForUploadFolder = './../angularjs/upload/managers';
    upload(req,res,function (err){
        if(err){
            return res.end("err in upload")
        }
        var admin = req.body.admin;
        var name = admin.name != null ? admin.name : null;
        var phone = admin.phone != null ? admin.phone : null;
        var email = admin.email != null ? admin.email : null;
        var role = admin.role != null ? admin.role : null;
        var userName = admin.userName != null ? admin.userName : null;
        var password = admin.password!= null ? admin.password : null;
        if (name == null || name == "" || phone == null || phone == "" || email == null || email == ""
            || role == null || role == "" || userName == null || userName == "" || password == null || password == "") {
            var filePath = "./../angularjs/upload/managers/"+req.file.filename;
            fs.unlinkSync(filePath);
            return res.send(msg.fieldMissing);
        }
        admin.image = "upload/managers/"+ req.file.filename;
        var insertQuery = squel.insert()
        .into("administration")
            .set("name",  admin.name)
            .set("phone", admin.phone)
            .set("email", admin.email)
            .set("role", admin.role)
            .set("user_name", admin.userName)
            .set("password", admin.password)
            .set("image", admin.image)
            .toString();
        con.query(insertQuery,function(err,rows){
            if(err)
            {
                console.log("err: ",err);
            }
            else
            {
                res.send({rows:rows,path:admin.image});
            }
        });
    })
});

module.exports = router;