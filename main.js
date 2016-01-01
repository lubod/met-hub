var express = require('express');
var app = express();
var fs = require("fs");
app.use(express.static(__dirname));  

app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/getData', function (req, res) {
   fs.readFile( __dirname + "/data/" + req.query.file, 'ascii', function (err, data) {
//       console.log( req.query.file );
		res.type('text/plain');
       res.send( data );
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
