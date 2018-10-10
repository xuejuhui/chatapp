var express = require('express');
var bodyParser = require('body-parser');
var sockets = require('./sockets')


var app = express();


app.get('/', function(req, res){
	res.send('hello')
})


app.set('port', (process.env.PORT || 5000));
server = app.listen(app.get('port'), function(){
	console.log(`server is listening on port ${ server.address().port}`)
})

sockets.init(server);