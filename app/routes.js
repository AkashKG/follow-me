module.exports = function(app) {
	app.get('/me', function(req, res) {
		res.sendfile('./resume/index.html');
	});
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
};