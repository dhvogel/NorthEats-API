//server.js

//modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var aws = require('aws-sdk');

var port = process.env.PORT || 8080;

app.use(bodyParser.json());

//parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

//set the static files location. so /public/index.html will be just index.html for users
app.use(express.static(__dirname + "/public"));

//routes
require('./routes/index')(app);

//start app at whatever port we specified
var server = app.listen(port);

//let the user know whas goin on
console.log("Magic happens on port " + port);

exports = module.exports = app;
