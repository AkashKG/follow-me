var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var wagner = require('wagner-core');
var methodOverride = require('method-override');

var port = 9191;

require('./models/models.js')(wagner);
//wagner.invoke(require('./app/auth'),{app:app});
app.use('/api/v1', require('./app/api.js')(wagner));

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/public')); 
require('./app/routes')(app); 

app.listen(port);
console.log("Goto Port : " + port);

exports = module.exports = app;