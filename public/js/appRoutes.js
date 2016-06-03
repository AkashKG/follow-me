angular.module('appRoutes', []).config(
		[ '$routeProvider', '$locationProvider',
				function($routeProvider, $locationProvider) {
					$routeProvider
					.when('/', {
						templateUrl : 'views/home.html',
						controller : 'homeController'
					})
					.when('/login',{
						templateUrl:'views/login.html',
						controller: 'loginController'
					})
					.when('/profile',{
						templateUrl:'views/profile.html',
						controller: 'profileController'
					})
					$locationProvider.html5Mode(true);

				} ]);