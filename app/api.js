var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

	/*--  Add Book --*/
	api.post('/notebooks/newnotebook/:id', wagner.invoke(function(Todo, User) {
		return function(req, res) {
			Todo.create({
				authorId:req.params.id,
				title : req.body.title,
				description: req.body.description,
				date: req.body.date,
				done : false
			}, function(err, todo) {
				if (err)
					res.send(err);
				console.log(todo);
				User.update({ _id: req.params.id }, 
						    { $push: { todoList: todo } },function(err,done){
						    	
						    }
						);
				
				Todo.find(function(err, todo) {
					if (err)
						res.send(err)
					res.json(todo);
				});
			});
		}
	}));
	
	api.get('/notebooks/all', wagner.invoke(function(Todo) {// done
		return function(req, res) {
			var sort = {
				name : 1
			};
			Todo.find({
			}).sort(sort).exec(handleMany.bind(null, 'todos', res));
		};
	}));
	api.get('/notebooks/mybooks/:id', wagner.invoke(function(User) {
		return function(req, res) {
			User.findOne({
				_id : req.params.id
			},{profile:0}, function(error, user) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!user) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				res.json({
					user : user
				});
			});
		};
	}));
	api.delete('/notebook/delete/:id/:authorId', wagner.invoke(function(Todo, User){// done
		return function(req, res){
			Todo.remove({
				_id:req.params.id, authorId:req.params.authorId
			}, function(err, todo){
				if(err)
					res.send(err);
				User.update({_id:req.params.authorId},{$pull:{todoList:{_id:req.params.id}}}, function(err,data){
					if(err){
						console.log(err);
						return res.status(500).json({'error' : "FUCKED UP"});
					}
					console.log(data);
				});
				Todo.find(function(err, todo) {
					if (err)
						res.send(err)
					res.json(todo);
				});
			});
		}
	}));
	
	api.get('/me', isLoggedIn, function(req, res) {// done
		if (!req.user) {
			return res.status(status.UNAUTHORIZED).json({
				error : 'Not logged in'
			});
		}

		req.user.populate({
			path : 'data.profile',
			model : 'Todo'
		}, handleOne.bind(null, 'user', res));
	});
	return api;
}


function handleOne(property, res, error, result) {
	if (error) {
		return res.status(status.INTERNAL_SERVER_ERROR).json({
			error : error.toString()
		});
	}
	if (!result) {
		return res.status(status.NOT_FOUND).json({
			error : 'Not found'
		});
	}

	var json = {};
	json[property] = result;
	res.json(json);
}

function handleMany(property, res, error, result) {
	if (error) {
		return res.status(status.INTERNAL_SERVER_ERROR).json({
			error : error.toString()
		});
	}

	var json = {};
	json[property] = result;
	res.json(json);
}
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}