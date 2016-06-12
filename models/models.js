var mongoose = require('mongoose');
var _ = require('underscore');
var autoIncrement = require('mongoose-auto-increment');
module.exports = function(wagner){
	var connection = mongoose.connect('mongodb://AkashKG:Akash95!@ds037467.mlab.com:37467/followme');
	autoIncrement.initialize(connection);
	var Todo = mongoose.model('Todo', require('./todo'), 'todos');
	var User = mongoose.model('User', require('./user'), 'users');
	var Username = mongoose.model('Username', require('./username'), 'usernames');
	var Resume = mongoose.model('Resume', require('./resume'), 'resumes');
	var models = {
			Todo:Todo,
			User:User,
			Resume:Resume,
			Username:Username
	}
	_.each(models, function(value, key) {
	    wagner.factory(key, function() {
	      return value;
	    });
	});
	return models;
}