function setupAuth(User, app) {
	var passport = require('passport');
	var FacebookStrategy = require('passport-facebook').Strategy;
	TwitterStrategy = require('passport-twitter').Strategy;
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id : id
		}).exec(done);
	});

	passport.use(new TwitterStrategy({

        consumerKey     : 'hK6eaHbP16RnGEHgPAttdR0hm',
        consumerSecret  : 'uULlyaXZEk0lzojRHf7MYFJZyVJJUYQzTsVyDw6SBNMWhGJMLK',
        callbackURL     : 	"https://fodo.herokuapp.com/auth/twitter/callback"
       // callbackURL     : 	"http://127.0.0.1:8181/auth/twitter/callback"

    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
        	
            User.findOne({ 'profile.data.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user); 
                } else {
                    var newUser                 = new User();
                    newUser.profile.data.id          = profile.id;
                    newUser.profile.data.token       = token;
                    newUser.profile.data.username    = profile.username;
                    newUser.profile.name = profile.displayName;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

    });

    }));

	passport.use(new FacebookStrategy(
			{
				clientID : '1023976460970849',
				clientSecret : '281d125a8f4e30ccb4c480011a008b57',
				callbackURL : "https://fodo.herokuapp.com/auth/facebook/callback",
				"profileFields" : [ "id", "email", "displayName", "gender",
						"location" ]
			}, function(accessToken, refreshToken, profile, done) {
				if (!profile.emails || !profile.emails.length) {
					return done('No emails associated with this account. . .');
				}
				User.findOneAndUpdate({
					'profile.data.outh' : profile.id
				}, {
					$set : {
						'profile.data.email' : profile.emails[0].value,
						'profile.name' : profile.displayName,
						'profile.picture' : 'https://graph.facebook.com/'
								+ profile.id.toString() + '/picture?type=large'
					}
				}, {
					'new' : true,
					upsert : true,
					runValidators : true
				}, function(error, user) {
					done(error, user);
				});
			}));
	// Express middlewares
	app.use(require('express-session')({
		secret : 'this is a secret',
		resave : true,
		saveUninitialized : true
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	// Express routes for auth

	app
			.get(
					'/auth/facebook',
					function(req, res, next) {
						var redirect = encodeURIComponent(req.query.redirect
								|| '/');
						passport
								.authenticate(
										'facebook',
										{
											scope : [ 'email', 'user_location',
													'user_birthday',
													'public_profile' ],
											callbackURL : 'https://fodo.herokuapp.com/auth/facebook/callback?redirect='
													+ redirect
										})(req, res, next);
					});

	app.get('/auth/facebook/callback', function(req, res, next) {
		var url = 'https://fodo.herokuapp.com/auth/facebook/callback?redirect='
				+ encodeURIComponent(req.query.redirect);
		passport.authenticate('facebook', {
			callbackURL : url
		})(req, res, next);
	}, function(req, res) {
		res.redirect(req.query.redirect);
	});
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


	app.get('/auth/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}
module.exports = setupAuth;