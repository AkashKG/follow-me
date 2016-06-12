var mongoose = require('mongoose');

var resumeSchema = {
		username:{
			type:String,
			unique:true
		},
		author:mongoose.Schema.Types.ObjectId,
		basicInfo:{
			name:{
				type:String
			},
			email:{
				type:String
			},
			college:{
				type:String
			},
			currentLocation:{
				type:String
			},
			image:{
				type:String
			}
		},
		onlineExistence:[{
			name:{
				type:String
			},
			url:{
				type:String
			}
		}],
		timeline:[{
			name:{
				type:String
			},
			description:{
				type:String
			},
			url:{
				type:String
			}
		}],
		education:{
			btech:{
				name:{
					type:String,
				},
				description:{
					type:String
				}
			},
			intermediate:{
				name:{
					type:String
				},
				description:{
					type:String
				}
			},
			matric:{
				name:{
					type:String
				},
				description:{
					type:String
				}
			}
		},
		technologyAdvanced:[{
			name:String,
			icon:String,
			description:String
		}],
		technologyBasic:[{
			name:String,
			icon:String,
			description:String
		}]
}

module.exports = new mongoose.Schema(resumeSchema);
module.exports.todoSchema = resumeSchema;