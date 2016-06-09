angular
		.module(
				'todoApp',
				[ 'ngRoute', 'ngMaterial', 'ngAria', 'ngMessages', 'appRoutes',
						'homeCtrl', 'loginCtrl', 'profileCtrl', 'todoCtrl', 'logoutCtrl','material.svgAssetsCache','blockUI' ])

.config(
		[ '$routeProvider', '$locationProvider','blockUIConfig',
				function($routeProvider, $locationProvider,blockUIConfig) {
			blockUIConfig.blockBrowserNavigation = true;
			blockUIConfig.requestFilter = function(config) {
				  if(config.url.match(/^\/api\/v1\/notebooks\/todo\/update($|\/).*/)) {
				    return false; // ... don't block it.
				  }
			}
			blockUIConfig.templateUrl = 'views/templates/overlay.html';
			$routeProvider
					.when('/', {
						templateUrl : 'views/login.html',
						controller : 'loginController'
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
					.when('/logout',{
						template:'<body>HELLO</body'
					})
					$locationProvider.hashPrefix('!');
					$locationProvider.html5Mode(true);

				} ])
						.run(
				[
						'$rootScope',
						'$location',
						'userService',
						'dialogFactory',
						function($rootScope, $location, userService,
								dialogFactory) {
							userService.getUser().then(function(data) {
								console.log(data);
								if(data.data.user){
									$rootScope.isLoggedIn = true;
									if ($location.path() === '/'||$location.path() === '/login')
										$location.path('/profile')
								}	
								else{
									$rootScope.isLoggedin=false;
									if($location.path()=='/'){
										
									}
									else if($location.path()!='/login'){
									dialogFactory.showAlert("Please Login!", "Continue login to view your profile");
									$location.path('/login');
									}
								}
							}, function(err) {
								
							});
							$rootScope.user = {};
						} ])

		.factory(
				'dialogFactory',
				[
						'$mdDialog',
						'$mdToast',
						function($mdDialog, $mdToast) {
							return {
								showToast : function(text) {
									var toast = $mdToast.simple().content(text)
											.action('OK')
											.highlightAction(false).hideDelay(
													30000).position("top");
									$mdToast.show(toast).then(
											function(response) {
												if (response == 'ok') {
													debugger;
												}
											});
								},
								showAlert : function(title, content) {
									$mdDialog.show($mdDialog.alert()
											.clickOutsideToClose(true).title(
													title).content(content)
											.ariaLabel('Alert Dialog Demo').ok(
													'Got it!'));
								}
							}
						} ])
		.service(
				'noteService',
				[
						'$http',
						'$rootScope',
						'$location',
						function($http, $rootScope, $location) {

							return {
								getAllNotes : function() {
									return $http
											.get('/api/v1/notebooks/all')
											.success(function(data) {
												return data;
											})
											.error(
													function(data, status) {
														if (status = status.UNAUTHORIZED) {
															return null;
														}
													});
								},

								getMyNotes : function(id) {
									return $http
											.get(
													'api/v1/notebooks/mybooks/'
															+ id)
											.success(function(data) {
												return data;
											})
											.error(
													function(data, status) {
														if (status = status.UNAUTHORIZED) {
															return null
														}
													});

								},

							}
						} ])

		.filter('reverse', function() {
			return function(items) {
				if (items)
					return items.slice().reverse();
			};
		})

		.service(
				'userService',
				[
						'$q',
						'$http',
						'$rootScope',
						'$location',
						function($q, $http, $rootScope, $location) {
							return {
								getUser : function() {
									return $http.get('api/v1/me').success(
											function(data) {
													return data;
											}).error(function(data, status) {
										if (status = status.UNAUTHORIZED) {
											return null
										}
									});
								}
							};
						} ])
						
	.factory('logoutFactory', [ '$q', '$timeout', '$http', '$rootScope',
		function($q, $timeout, $http, $rootScope) {
			return {
				logout : function() {
					var deferred = $q.defer();
					$http.get('/auth/logout').success(function(data) {
						$rootScope.isLoggedIn=false;
						$rootScope.user={};
						deferred.resolve();
					}).error(function(data) {
						
						deferred.reject();
					})
					return deferred.promise;
				},
			}
		} ]);
