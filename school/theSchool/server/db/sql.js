var mysql = require('mysql');

 var con = mysql.createConnection({
     host:'127.0.0.1',
     user:'root',
     password: 'admin',
     database:'school',
     multipleStatements: false
 });

 module.exports = con;