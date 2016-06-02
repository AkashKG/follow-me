var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var wagner = require("wagner-core");
var methodOverride = require("method-override");

var port = 6969;
app.listen(port);
console.log("6969");