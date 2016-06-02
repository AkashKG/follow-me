angular.module('homeCtrl', []).controller(
		'homeController',
		function($scope, $timeout, $mdBottomSheet, $mdToast) {
			$scope.temp = "Follow Me";
			$scope.currentNavItem = 'page1';
			$scope.showGridBottomSheet = function() {
				$scope.alert = '';
				$mdBottomSheet.show({
					templateUrl : './views/templates/bottomSheet.html',
					controller : 'GridBottomSheetCtrl',
					clickOutsideToClose : false
				}).then(
						function(clickedItem) {
						
						});
			};
		}).controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
	$scope.items = [ {
		name : 'person',
		icon : 'message'
	}, {
		name : 'phone',
		icon : 'phone'
	}, {
		name : 'Message',
		icon : 'email'
	}, {
		name : 'laptop',
		icon : 'book'
	}, {
		name : 'copy',
		icon : 'settings'
	}, {
		name : 'Twitter',
		icon : 'add'
	}, ];

	$scope.listItemClick = function($index) {
		var clickedItem = $scope.items[$index];
		$mdBottomSheet.hide(clickedItem);
	};
});