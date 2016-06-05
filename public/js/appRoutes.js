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
						/*resolve : {
							"check" : function($location, $rootScope) {
								if (!$rootScope.isLoggedIn) {
									$location.path('/');
								}
							}
						},*/
						templateUrl:'views/profile.html',
						controller: 'profileController'
					})
					.when('/profile/alltodos/:user/:nIndex/:index', {
						templateUrl : 'views/notebook/todopage.html',
						controller : 'todoController'
					})
					$locationProvider.html5Mode(true);

				} ]);