var mongoose = require('mongoose');
var _ = require('underscore');
var autoIncrement = require('mongoose-auto-increment');
module.exports = function(wagner){
	var connection = mongoose.connect('mongodb://localhost:27017/followmeworks');
	autoIncrement.initialize(connection);
	var Todo = mongoose.model('Todo', require('./todo'), 'todos');
	var User = mongoose.model('User', require('./user'), 'users');
	var models = {
			Todo:Todo,
			User:User
	}
	_.each(models, function(value, key) {
	    wagner.factory(key, function() {
	      return value;
	    });
	});
	return models;
}