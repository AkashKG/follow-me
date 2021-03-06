var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());
	api.get('/me', isLoggedIn, function(req, res) {// done
		if (!req.user._id) {
			return res.status(status.UNAUTHORIZED).json({
				error : 'Not logged in'
			});
		}
		req.user.populate({
			path : 'data.profile',
			model : 'User'
		}, handleOne.bind(null, 'user', res));
	});
	
	
	api.get('/user/me',wagner.invoke(function(User){
		return function(req,res){
			if(req.user==undefined){
				return res.json({error:'Not logged in.'});			
			}
			else{
				console.log(req.user.profile);
				res.json({profile:req.user.profile});
			}
		}
	}));
	api.get('/user/me/id',wagner.invoke(function(User){
		return function(req,res){
			if(req.user==undefined){
				return res.json({error:'Not logged in.'});			
			}
			else{
				//console.log(req.user.profile);
				res.json({id:req.user._id});
			}
		}
	}));
	/* Not required */
	/*
	 * api.get('/notebooks/all', wagner.invoke(function(User) {// done return
	 * function(req, res) { if(req.user){ var sort = { name : 1 }; User.find({ },
	 * {profile:0}).sort(sort).exec(handleMany.bind(null, 'todos', res)); }
	 * else{ return res.status(status.UNAUTHORIZED).json({error:'Unauthorized
	 * access'}); } } }));
	 */
	

	api.post('/notebooks/newnotebook', wagner.invoke(function(User) {
		return function(req, res) {
			if(req.user._id==undefined){
				res.json({error:"Error"})
			}
			else{
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
		}
	}));
	api.post('/addresume/resume',wagner.invoke(function(Resume,Username, User){
		return function(req,res){
			Resume.findOneAndUpdate({
				username : req.body.username/* , req.user._id:req.body.author */
			}, {
				$set : {
					username:req.body.username,
					basicInfo:req.body.basicInfo,
					onlineExistence:req.body.online,
					timeline:req.body.timeline,
					education:req.body.education,
					technologyAdvanced:req.body.technologyAdvanced,
					technologyBasic:req.body.technologyBasic
				}
			}, {
				'new' : true,
				upsert : true,
				runValidators : true
			}, function(err,resume){
				if(err){
					res.json({error:'error'})
				}
				else
					res.json({success:'success'});
			});
		}
	}));
	api.get('/getresume',wagner.invoke(function(Resume){
		return function(req,res){
		Resume.findOne({author:req.user._id}, function(err,resume){
			if(err){
				res.json({error:'No resume'});
			}
			else{
				res.json(resume);
			}
		})
	}
	}));
	api.put('/notebooks/todo/update/:pid',wagner.invoke(function(Todo,User){
		return function(req,res){
			if(req.user._id){
				var taskIndex=req.body.taskIndex;
				var todoIndex=req.body.todoIndex;
				updated = 'todoList.$.todos.'+todoIndex+'.updated';
				var update={};
				update[updated]=req.body.updated;
				done = 'todoList.$.todos.'+todoIndex+'.tasks.'+taskIndex+'.done';
				var did ={};
				did[done]=req.body.done;
				User.update({'todoList._id':req.params.pid, _id:req.user._id},{$set:update}, function(err,done){
				User.update({'todoList._id':req.params.pid, _id:req.user._id},{$set:did}, function(err,done){
					if(err)	
						res.json({error:'Unauthorized Or not found'})
					res.json({success:'Updated'});
				})
			})
			
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});	
			}
	}}));
	api.put('/notebooks/updateone', wagner.invoke(function(User){
		return function(req, res){
			if(req.user._id){
				User.update({'todoList._id':req.body._id, _id:req.user._id},{$set:{'todoList.$.title':req.body.title, 'todoList.$.description':req.body.description}}, function(err,done){
					//console.log(err);
					if(err){
						res.json({error:'Something went wrong'})
					}
					//console.log(done);
					res.json({success:'Success'})
				})
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});	
			}
		}
	}))
	api.put('/notebooks/todos/updateone', wagner.invoke(function(User){
		return function(req, res){
			if(req.user._id){
				title = 'todoList.$.todos.' + req.body.index + '.title';
				var up={};
				up[title]=req.body.title;
				User.update({'todoList.todos._id':req.body._id, _id:req.user._id},{$set:up}, function(err,done){
					//console.log(err);
					if(err){
						res.json({error:'Something went wrong'})
					}
					//console.log(done);
					
				})
				updated = 'todoList.$.todos.' + req.body.index + '.updated';
				var up_={};
				up[updated]=req.body.updated;
				User.update({'todoList.todos._id':req.body._id, _id:req.user._id},{$set:up_}, function(err,done){
					//console.log(err);
					if(err){
						res.json({error:'Something went wrong'})
					}
					//console.log(done);
					
				})
				deadline = 'todoList.$.todos.' + req.body.index + '.deadline';
				var up__={};
				up__[deadline]=req.body.deadline;
				User.update({'todoList.todos._id':req.body._id, _id:req.user._id},{$set:up__}, function(err,done){
					//console.log(err);
					if(err){
						res.json({error:'Something went wrong'})
					}
					//console.log(done);
					res.json({success:'true'})
				})
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});	
			}
		}
	}))
	api.put('/notebooks/todo/task/update/:taskId/:pid/:parent/:date', wagner.invoke(function(User){
		return function(req,res){
			console.log(req.body);
			console.log(req.params.taskId);
			if(req.user._id){
				updated = 'todoList.$.todos.'+req.params.pid+'.updated';
				var up={};
				up[updated]=req.params.date;
				tasks = 'todoList.$.todos.'+ req.params.pid +'.tasks.' + req.params.taskId;
				console.log(tasks);
				var update={};
				update[tasks]=req.body;
				User.update({_id:req.user._id, 'todoList._id':req.params.parent},{$set:update}, function(err,done){
					if(err)	
						res.json({error:'Unauthorized Or not found'})
					/**/
					console.log("updated");
				})
				User.update({'todoList._id':req.params.parent, _id:req.user._id},{$set:up}, function(err,done){
					if(err)	
						res.json({error:'Unauthorized Or not found'})
					res.json({success:'Updated'})
				});
			}
			else{
				return res.status(status.UNAUTHORIZED).json({error:'Unauthorized access, your account will be reported'});	
			}
		}
	}));
	
	api.post('/newtodo/newtask/:tid/:todoIndex',wagner.invoke(function(User){
		return function(req,res){
			if(req.user._id){
				var task = req.body;
				var pos='todoList.$.todos.' + req.params.todoIndex+'.tasks';
				var obj={}
				obj[pos]=task;
				User.update({'todoList.todos._id':req.params.tid,_id:req.user._id},{
					"$push":obj
				},function(err,done){
					if(err)
						res.send(err);
					var update={};
					updated = 'todoList.$.todos.'+ req.params.todoIndex+'.updated';
					update[updated]=req.body.updated;
					User.update({'todoList.todos._id':req.params.tid, _id:req.user._id},{$set:update}, function(err,done){
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
	
	api.post('/notebooks/newTodo/:noteId', wagner.invoke(function(User) {
		return function(req, res) {
			if(req.user._id){
			var todo = req.body;
			User.update(
				    { "todoList._id": req.params.noteId , _id:req.user._id},
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

	api.get('/notebooks/mybooks', wagner.invoke(function(User) {
		return function(req, res) {
			if(req.user==undefined){
				return res.json({error:'Not logged in.'});			
			}
			else if(req.user._id){
				User.findOne({_id:req.user._id}, function(err,user){
					if(err)
						res.send(json);
					var todoList = user.todoList;
					res.json({todoList:todoList});
				})
			
			}
			}
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