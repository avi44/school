//expoeres withe express
var express = require("express");
var router = express.Router();
var fs = require("fs");
var msg = require("../messages/messages");
var con = require('../db/sql');
var squel = require("squel");
var async = require("async");
var multer  = require('multer');
var pathForUploadFolder ='';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathForUploadFolder)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname);
    }
});

var upload = multer({ storage: storage }).single("file");

router.post('/sales/addStudent', function (req, res) {
    var student = req.body;
    var name = student.name != null ? student.name : null;
    var phone = student.phone != null ? student.phone : null;
    var email = student.email != null ? student.email : null;
    var image = student.image != null ? student.image : null;
    if (name == null || name == "" || phone == null || phone == ""
        || email == null || email == "" || image == null || image == "") {
        return res.send(msg.fieldMissing);
    }
    var insertQuery = squel.insert()
        .into("students")
        .set("name",student.name)
        .set("phone",student.phone)
        .set("email",student.email)
        .set("image",student.image)
        .toString();
    con.query(insertQuery,function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send({rows:rows});
        }});
});

router.post('/sales/addStudentCourses', function (req, res) {
    var student = req.body;
    var insertThis = student.coursesIds;
    if(insertThis.length ==0) {return}
    var arrayOfCoursesObj = [];
    for(var i=0; i<insertThis.length;i++){
        arrayOfCoursesObj.push({s_id:student.id,c_id:insertThis[i]})
    }
    var insertCoursesQuery = squel.insert()
        .into("student_courses")
        .setFieldsRows(arrayOfCoursesObj)
        .toString();
    con.query(insertCoursesQuery,function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send({rows:rows});
        }});
});

router.post('/sales/deleteCourse', function (req, res) {
    var course = req.body;
    var filePath = "./../angularjs/"+course.image;
    fs.unlinkSync(filePath);
    var deleteQuery = squel.delete()
        .from("courses")
        .where("id=?",course.id)
        .toString();
    con.query(deleteQuery,function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send({rows: rows});
        }});
});

router.post('/sales/deleteStudent', function (req, res) {
    var student = req.body;
    var filePath = "./../angularjs/"+student.image;
    fs.unlinkSync(filePath);
    var deleteThis = student.idsOfCourses;
    var multipleQuery = [];
    if(deleteThis.length !=0){
        var stringOfDeleteThis = deleteThis.toString();
        var deleteCoursesQuery = squel.delete()
            .from("student_courses")
            .where("student_courses.c_id IN("+stringOfDeleteThis+")")
            .where("student_courses.s_id=?",student.id)
            .toString();
        multipleQuery.push(function(callback) {
            con.query(deleteCoursesQuery, callback);
        })
    }
    var deleteStudentQuery = squel.delete()
        .from("students")
        .where("id=?",student.id)
        .toString();
    multipleQuery.push(function(callback) {
        con.query(deleteStudentQuery, callback);
    });
    function sendRes() {
        res.send({"res":"res"})
    }
    async.parallel(multipleQuery,
        function(err, res) {
            if (err) {
                console.log("err: ", err);
            }
            else {
                sendRes();
            }
        });
});

router.get('/sales/getStudents', function (req, res,next) {
    con.query(squel.select()
        .from("students")
        .field("students.id","s_id")
        .field("students.name","s_name")
        .field("students.phone")
        .field("students.email")
        .field("students.image","s_image")
        .field("courses.id","c_id")
        .field("courses.name","c_name")
        .field("courses.description")
        .field("courses.image","c_image")
        .left_join("student_courses",null, "students.id = student_courses.s_id")
        .left_join("courses",null, "courses.id = student_courses.c_id")
        .toString(),function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            getCoursesOfStudent = function(){

                student = function(student){
                    this.id = student.s_id;
                    this.name = student.s_name;
                    this.phone= student.phone;
                    this.email= student.email;
                    this.image = student.s_image;
                    this.courses = [];
                };
                courses = function(course){
                    this.id = course.c_id;
                    this.name = course.c_name;
                    this.description = course.description;
                    this.image = course.c_image;
                };

                var list = [];
                for(var i=0; i<rows.length; i++) {
                    if(list[rows[i].s_id]!=undefined && rows[i].c_id!=null){
                        list[rows[i].s_id].courses.push(new courses(rows[i]))
                    }
                    else{
                        list[rows[i].s_id] = new student(rows[i]);
                        if(rows[i].c_id!=null){
                            list[rows[i].s_id].courses.push(new courses(rows[i]))
                        }
                    }
                }
                list = list.filter(function(obj) {
                    return obj!==undefined;
                });
                return list;
            };
            res.send(getCoursesOfStudent());
        }});
});

router.get('/sales/getCourses', function (req, res,next) {
    con.query(squel.select()
        .from("courses")
        .field("courses.id","c_id")
        .field("courses.name","c_name")
        .field("courses.description")
        .field("courses.image","c_image")
        .field("students.id","s_id")
        .field("students.name","s_name")
        .field("students.phone")
        .field("students.email")
        .field("students.image","s_image")
        .left_join("student_courses",null, "courses.id = student_courses.c_id")
        .left_join("students",null, "students.id = student_courses.s_id")
        .toString(),function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            getStudentsOfCourse = function(){

                students = function(student){
                    this.id = student.s_id;
                    this.name = student.s_name;
                    this.phone= student.phone;
                    this.email= student.email;
                    this.image = student.s_image;

                };
                course = function(course){
                    this.id = course.c_id;
                    this.name = course.c_name;
                    this.description = course.description;
                    this.image = course.c_image;
                    this.students = [];
                };

                var list = [];
                for(var i=0; i<rows.length; i++) {
                    if(list[rows[i].c_id]!=undefined && rows[i].s_id!=null){
                        list[rows[i].c_id].students.push(new students(rows[i]))
                    }
                    else{
                        list[rows[i].c_id] = new course(rows[i]);
                        if(rows[i].s_id!=null){
                            list[rows[i].c_id].students.push(new students(rows[i]))
                        }
                    }
                }
                list = list.filter(function(obj){
                    return obj!==undefined;
                });
                return list;
            };
            res.send(getStudentsOfCourse());
        }});
});

router.post('/sales/updateStudent', function (req, res) {
    var student = req.body;
    var name = student.name != null ? student.name : null;
    var phone = student.phone != null ? student.phone : null;
    var email = student.email != null ? student.email : null;
    var image = student.image != null ? student.image : null;
    if (name == null || name == "" || phone == null || phone == ""
        || email == null || email == "" || image == null || image == "") {
        return res.send(msg.fieldMissing);
    }
    var multipleQuery = [];
    function dbExecution() {
        async.parallel(multipleQuery,
            function (err, res) {
                if (err) {
                    console.log("multipleQuery err: ", err);
                }
                else {
                    sendFilters();
                }
            });
    }
    var updateFieldsQuery = squel.update()
        .table("students")
        .set("name", student.name)
        .set("phone", student.phone)
        .set("email", student.email)
        .set("image", student.image)
        .where("id =?",student.id)
        .toString();
        multipleQuery.push(function(callback) {
            con.query(updateFieldsQuery, callback);
        });

    var coursesObject = student.courses;
    var courses = [];
    for(var l=0;l<coursesObject.length;l++) {
        courses.push(coursesObject[l].id)
    }
    var newCourses = student.newIdCoursesOfStudent;
    var valuesForDelete = [];
    for(var k=0;k<courses.length;k++){
        for(var j=0;j<newCourses.length;j++){
            if(courses[k] == newCourses[j] ){valuesForDelete.push(courses[k])}
        }
    }
    var deleteThis = courses.filter(function(el){
        return valuesForDelete.indexOf(el)<0;
    });
    var insertThis = newCourses.filter(function(el){
        return valuesForDelete.indexOf(el)<0;
    });

    if(deleteThis.length ==0 && insertThis.length ==0){dbExecution()}
        else {
        if (deleteThis.length != 0) {
            var stringOfDeleteThis = deleteThis.toString();
            var deleteCoursesQuery = squel.delete()
                .from("student_courses")
                .where("student_courses.c_id IN("+stringOfDeleteThis+")")
                .where("student_courses.s_id=?",student.id)
                .toString();
            multipleQuery.push(function (callback) {
                con.query(deleteCoursesQuery, callback);
            })
        }
        if (insertThis.length != 0) {
            var arrayOfCoursesObj = [];
            for(var i=0; i<insertThis.length;i++){
                arrayOfCoursesObj.push({s_id:student.id,c_id:insertThis[i]})
            }
            var insertCoursesQuery = squel.insert()
                .into("student_courses")
                .setFieldsRows(arrayOfCoursesObj)
                .toString();
            multipleQuery.push(function (callback) {
                con.query(insertCoursesQuery, callback);
            })
        }
        dbExecution();
    }
    function sendFilters() {
        res.send({coursesDelete: deleteThis, coursesInsert: insertThis})
    }
});

router.post('/manager/updateCourse', function (req, res) {
    var course = req.body;
    var name = course.name != null ? course.name : null;
    var description = course.description != null ? course.description : null;
    var image = course.image != null ? course.image : null;
    if (name == null || name == "" || description == null || description == "" || image == null || image == "") {
        return res.send(msg.fieldMissing);
    }
    var updateQuery = squel.update()
        .table("courses")
        .set("name", course.name)
        .set("description", course.description)
        .set("image", course.image)
        .where("id =?",course.id)
        .toString();
    con.query(updateQuery,function(err,rows){
        if(err)
        {
            console.log("err: ",err);
        }
        else
        {
            res.send({rows: rows});
        }});
});

router.post('/sales/uploadFileStudent', function (req, res) {
    pathForUploadFolder = './../angularjs/upload/students';
    upload(req,res,function (err){
        if(err){
            return res.end("err in upload")
        }
        var path = "upload/students/"+ req.file.filename;
        res.send({path:path})
    })
});

router.post('/sales/uploadFileCourse', function (req, res) {
    pathForUploadFolder = './../angularjs/upload/courses';
    upload(req,res,function (err){
        if(err){
            return res.end("err in upload")
        }
        var path = "upload/courses/"+ req.file.filename;
        res.send({path:path})
    })
});

router.post('/sales/addCourse', function (req, res) {
        pathForUploadFolder = './../angularjs/upload/courses';
        upload(req,res,function (err){
            if(err){
                return res.end("err in upload")
            }
            var course = req.body.course;
            var name = course.name != null ? course.name : null;
            var description = course.description != null ? course.description : null;
            if (name == null || name == "" || description == null || description == "") {
            var filePath = "./../angularjs/upload/courses/"+req.file.filename;
            fs.unlinkSync(filePath);
                return res.send(msg.fieldMissing);
            }
                course.image = "upload/courses/" + req.file.filename;
            var insertQuery  = squel.insert()
                .into("courses")
                .set("name", course.name)
                .set("description", course.description)
                .set("image", course.image)
                .toString();
                con.query(insertQuery, function (err, rows) {
                    if (err) {
                        console.log("err: ", err);
                    }
                    else {
                        res.send({rows: rows, path: course.image});
                    }
                });
        });
});

module.exports = router;