var mongoose = require('mongoose');

var usernameSchema={
	username:[{
		type:String
	}]
};

module.exports = new mongoose.Schema(usernameSchema);
module.exports.userSchema = usernameSchema;