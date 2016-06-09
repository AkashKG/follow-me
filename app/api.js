var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());
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
	
	api.get('/notebooks/all', wagner.invoke(function(User) {// done
		return function(req, res) {
			if(req.user){
				var sort = {
					name : 1
				};
				User.find({
				}, {profile:0}).sort(sort).exec(handleMany.bind(null, 'todos', res));
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access'});
			}
		}
	}));
	
	api.post('/notebooks/newnotebook', wagner.invoke(function(User) {
		return function(req, res) {
			if(req.user._id == req.body.authorId ){
				User.update({ _id: req.user._id }, 
						{ $addToSet: { todoList: req.body } },function(err,done){
							if(err)
								res.send(err);
							res.json({done:'Notebook was added successfully!'});
						}
				);
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});
			}
		}
	}));
	api.put('/notebooks/todo/update/:pid/:uid',wagner.invoke(function(Todo,User){
		return function(req,res){
			if(req.user._id == req.params.uid){
			var taskIndex=req.body.taskIndex;
			var todoIndex=req.body.todoIndex;
			updated = 'todoList.$.todos.'+todoIndex+'.updated';
			var update={};
			update[updated]=req.body.updated;
			done = 'todoList.$.todos.'+todoIndex+'.tasks.'+taskIndex+'.done';
			var did ={};
			did[done]=req.body.done;
			User.update({'todoList._id':req.params.pid},{$set:update}, function(err,done){
				User.update({'todoList._id':req.params.pid},{$set:did}, function(err,done){
					if(err)	
						res.send(err)
					res.json({success:'Updated'});
				})
			})
			
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});	
			}
			
			
	}}));
	
	api.post('/newtodo/newtask/:tid/:todoIndex/:uid',wagner.invoke(function(User){
		return function(req,res){
			if(req.user._id == req.params.uid){
				var task = req.body;
				var pos='todoList.$.todos.' + req.params.todoIndex+'.tasks';
				var obj={}
				obj[pos]=task;
				User.update({'todoList.todos._id':req.params.tid},{
					"$push":obj
				},function(err,done){
					if(err)
						res.send(err);
					var update={};
					updated = 'todoList.$.todos.'+ req.params.todoIndex+'.updated';
					update[updated]=req.body.updated;
					User.update({'todoList.todos._id':req.params.tid},{$set:update}, function(err,done){
						if(err)
							res.send(err)
						res.send({success:'The task was added!'})
					})
				});
				
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});	
			}
		}
	}));
	
	api.post('/notebooks/newTodo/:uid/:noteId', wagner.invoke(function(User) {
		return function(req, res) {
			if(req.user._id == req.params.uid){
			var todo = req.body;
			User.update(
				    { "todoList._id": req.params.noteId },
				    { "$push": { "todoList.$.todos": todo } },
				    function(err,data) {
				       res.json({success:"Successfully added todo!"});
				    }
				);
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});	
			}
		}
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
	api.delete('/notebook/delete/:id/:authorId', wagner.invoke(function(User){// done
		return function(req, res){
			if(req.user._id == req.params.authorId){
				User.update({_id:req.params.authorId},{$pull:{todoList:{_id:req.params.id}}}, function(err,data){
					if(err)
						res.send(err);
					res.json({Deleted:'The notebook was deleted succesfully'})
				});
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});
			}
		}
	}));
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
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}