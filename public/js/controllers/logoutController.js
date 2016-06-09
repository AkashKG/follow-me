angular.module('logoutCtrl', []).controller(
		'logoutController',
		function($scope, $routeParams, $rootScope, logoutFactory, $window) {
			console.log()
			$scope.logout = function() {
				logoutFactory.logout().then(function() {
					$rootScope.isLoggedIn = false;
					$window.open('/login','_self');
				});
			};
		});