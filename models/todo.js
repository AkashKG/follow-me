var mongoose = require('mongoose');

var todoSchema = {
		authorId:mongoose.Schema.Types.ObjectId,
		notebooks:[{
			title:{
				type:String
			},
			todos:[{
				created:{
					type:Date
				},
				updated:{
					type:Date
				},
				title:{
					type:String
				},
				description:{
					type:String
				},
				tasks:[{
					done:Boolean,
					task:String
				}]
			}]
		}]
}

module.exports = new mongoose.Schema(todoSchema);
module.exports.todoSchema = todoSchema;