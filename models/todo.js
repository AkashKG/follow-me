var mongoose = require('mongoose');

var todoSchema = {
	authorId : mongoose.Schema.Types.ObjectId,
	date:{
		type:Date
	},
	title : {
		type : String
	},
	description : {
		type : String
	},
	todos : [ {
		created : {
			type : Date
		},
		updated : {
			type : Date
		},
		title : {
			type : String
		},
		deadline:{
			type:Date
		},
		tasks : [ {
			done : Boolean,
			task : String,
			link : String,
			solution:String
		} ]
	} ]
}

module.exports = new mongoose.Schema(todoSchema);
module.exports.todoSchema = todoSchema;