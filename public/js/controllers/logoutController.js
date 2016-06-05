angular.module('logoutCtrl', []).controller(
		'logoutController',
		function($scope, $routeParams, $rootScope, logoutFactory, $location) {
			console.log()
			$scope.logout = function() {
				logoutFactory.logout().then(function() {
					$rootScope.isLoggedIn = false;
					console.log($rootScope.user);
					$location.path('/login');
				});
			};
		});