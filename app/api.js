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
	
	api.post('/notebooks/newnotebook/:id', wagner.invoke(function(User) {
		return function(req, res) {
			if(req.user._id == req.params.id ){
				var todo={
					authorId:req.params.id,
					title:req.body.title,
					description:req.body.description,
					date:req.body.date,
					done:false
				};	
				User.update({ _id: req.params.id }, 
						{ $addToSet: { todoList: todo } },function(err,done){
							if(err)
								res.send(err);
							res.json({done:'done'});
						}
				);
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access'});
			}
		}
	}));
	api.put('/notebooks/todo/update/:pid',wagner.invoke(function(Todo,User){
		return function(req,res){
			var taskIndex=req.body.taskIndex;
			var todoIndex=req.body.todoIndex;
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
	
	api.post('/newtodo/newtask/:tid/:todoIndex',wagner.invoke(function(User){
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
	
	api.post('/notebooks/newTodo/:uid/:noteId', wagner.invoke(function(User) {
		return function(req, res) {
			var todo = req.body;
			User.update(
				    { "todoList._id": req.params.noteId },
				    { "$push": { "todoList.$.todos": todo } },
				    function(err,data) {
				       res.json(data);
				    }
				);
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
			User.update({_id:req.params.authorId},{$pull:{todoList:{_id:req.params.id}}}, function(err,data){
				if(err)
					res.send(err);
				res.json({Deleted:'The notebook was deleted succesfully'})
			});
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