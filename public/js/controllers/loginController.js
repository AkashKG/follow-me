angular.module('loginCtrl', []).controller('loginController',
		function($scope, $window, $rootScope) {
			$scope.facebookLogin = function(){
				$window.open('/auth/facebook?redirect=%2Fprofile','_self');
			}
		});