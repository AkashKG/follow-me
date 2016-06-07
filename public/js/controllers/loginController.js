angular.module('loginCtrl', []).config(function($mdIconProvider) {
    $mdIconProvider
    .icon('facebook', 'img/icons/facebook.svg', 32)
    .icon('twitter', 'img/icons/twitter.svg', 32);
}).controller('loginController',
		function($scope, $window, $rootScope) {
			$scope.facebookLogin = function(){
				$window.open('/auth/facebook?redirect=%2Fprofile','_self');
			}
			$scope.twitterLogin = function(){
				$window.open('/auth/twitter','_self');
			}
		});