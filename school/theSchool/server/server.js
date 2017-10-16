var app = require("./app");
console.log("app loaded");
var http = require("http");


var port = 3200;
app.set('port',port);

var myServer = http.createServer(app);
myServer.listen(port);


myServer.on('listening',onListen);
myServer.on('error',onError);


function onError(err){
   
console.log("- err");
}

function onListen(listen){

}

