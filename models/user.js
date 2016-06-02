var mongoose = require('mongoose');
var Todo = require('./todo');

var userSchema={
	profile:{
		name:{
			type:String
		},
		picture:{
			type:String
		},
		city:{
			type:String
		},
		gender:{
			type:String
		},
		data:{
			email:{
				type:String
			},
			username:{
				type:String
			}
		}
	},
	todoList:[Todo.todoSchema]
};

module.exports = new mongoose.Schema(userSchema);
module.exports.userSchema = userSchema;