angular
		.module(
				'todoApp',
				[ 'ngRoute', 'ngMaterial', 'ngAria', 'ngMessages', 'appRoutes',
						'homeCtrl', 'loginCtrl', 'profileCtrl','chart.js', 'todoCtrl', 'logoutCtrl','material.svgAssetsCache','blockUI', 'ui.codemirror' ])

.config(['ChartJsProvider', function (ChartJsProvider) {
	
  }])
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
					.when('/profile/alltodos/:nIndex/:index', {
						templateUrl : 'views/notebook/todopage.html',
						controller : 'todoController'
					})
					.when('/logout',{
						template:'<body>HELLO</body'
					})
					.when('/AkashGupta',{
						templateUrl:'views/templates/aboutme.html',
						controller:'homeController'
					})
					.when('/resume',{
						templateUrl:'views/templates/resume.html',
						controller:'resumeController'
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
								//console.log(data.data);
								if(data.data.profile){
									$rootScope.isLoggedIn = true;
									$rootScope.user=data.data.profile;
									if ($location.path() === '/'||$location.path() === '/login'){
										
										$location.path('/profile')
									}
								}	
								else{
									$rootScope.isLoggedin=false;
									if($location.path()=='/'||$location.path()=='/AkashGupta'||$location.path()=='/resume'){
										
									}
									else if($location.path()!='/login'){
										dialogFactory.showToast("Please Login!");
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
													800).position("bottom");
									$mdToast.show(toast).then(
											function(response) {
												
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
								getMyNotes : function() {
									return $http
											.get('api/v1/notebooks/mybooks')
											.success(function(data) {
												//console.log(data);
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
				if (items!=undefined)
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
									return $http.get('api/v1/user/me').success(
											function(data) {
													//console.log(data);
													return data;
											}).error(function(data, status) {
										if (status = status.UNAUTHORIZED) {
											return null
										}
									});
								},
								getUserId : function() {
									return $http.get('api/v1/user/me/id').success(
											function(data) {
													//console.log(data);
													return data;
											}).error(function(data, status) {
										if (status = status.UNAUTHORIZED) {
											return null
										}
									});
								},
								getUserResume : function() {
									return $http.get('api/v1/getresume').success(
											function(data) {
													console.log(data);
													if(data.error){
														return null;
													}
													return data;
											})
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
