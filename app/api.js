var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyparser.json());

	/*--  Add Book --*/
	api.post('/notebooks/newnotebook', wagner.invoke(function(Todo) {
		return function(req, res) {
			Todo.create({
				title : req.body.title,
				description: req.body.description,
				date: req.body.date,
				done : false
			}, function(err, todo) {
				if (err)
					res.send(err);
				Todo.find(function(err, product) {
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
	
	api.delete('/notebook/delete/:id', wagner.invoke(function(Todo){// done
		return function(req, res){
			Todo.remove({
				_id:req.params.id
			}, function(err, todo){
				if(err)
					res.send(err);
				Todo.find(function(err, todo) {
					if (err)
						res.send(err)
					res.json(todo);
				});
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
