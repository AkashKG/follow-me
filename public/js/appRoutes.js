angular.module('appRoutes', []).config(
		[ '$routeProvider', '$locationProvider',
				function($routeProvider, $locationProvider) {
					$routeProvider
					.when('/', {
						templateUrl : 'views/home.html',
						controller : 'homeController'
					})

					$locationProvider.html5Mode(true);

				} ]);