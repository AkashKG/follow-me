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
				User.update({ _id: req.params.id }, 
						    { $addToSet: { todoList: todo } },function(err,done){
						    	
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
	api.put('/notebooks/todo/update/:pid',wagner.invoke(function(Todo,User){
		return function(req,res){
			console.log(req.body);
			var taskIndex=req.body.taskIndex;
			var todoIndex=req.body.todoIndex;
			var done = 'todos.'+todoIndex+'.tasks.'+taskIndex+'.done';
			var updated = 'todos.'+todoIndex+'.updated';
			var up={};
			up[updated]=req.body.updated;
			var obj ={};
			obj[done]=req.body.done;
			console.log(done);
			Todo.update({_id:req.params.pid},{$set:up}, function(err,done){
				
			})
			Todo.update({_id:req.params.pid},{$set:obj}, function(err,done){
				
			})
			updated = 'todoList.$.todos.'+todoIndex+'.updated';
			var update={};
			update[updated]=req.body.updated;
			done = 'todoList.$.todos.'+todoIndex+'.tasks.'+taskIndex+'.done';
			var did ={};
			did[done]=req.body.done;
			User.update({'todoList._id':req.params.pid},{$set:update}, function(err,done){
				console.log( done);
			})
			User.update({'todoList._id':req.params.pid},{$set:did}, function(err,done){
				if(err)	
				res.send(err)
				res.json({done:'done'});
			})
			
			
	}}));
	
	api.post('/newtodo/newtask/:tid/:todoIndex',wagner.invoke(function(Todo,User){
		return function(req,res){
			var task = req.body;
			var pos='todoList.$.todos.' + req.params.todoIndex+'.tasks';
			var obj={}
			obj[pos]=task;
			User.update({'todoList.todos._id':req.params.tid},{
				"$push":obj
			},function(err,done){
				
			});
			var update={};
			updated = 'todoList.$.todos.'+ req.params.todoIndex+'.updated';
			update[updated]=req.body.updated;
			User.update({'todoList.todos._id':req.params.tid},{$set:update}, function(err,done){
				res.json(done);
			})
		}
	}));
	
	api.post('/notebooks/newTodo/:uid/:noteId', wagner.invoke(function(Todo, User) {
		return function(req, res) {
			var todo = req.body;
			Todo.update({ _id: req.params.noteId, authorId:req.params.uid}, 
				    { $push: { todos: todo } },function(err,done){
				    
				    }
				);
			User.update(
				    { "todoList._id": req.params.noteId },
				    { "$push": { "todoList.$.todos": todo } },
				    function(err,data) {
				       res.json(data);
				    }
				);
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