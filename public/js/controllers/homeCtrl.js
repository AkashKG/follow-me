angular.module('homeCtrl', [])

.controller('homeController', function($scope, $mdBottomSheet) {
	$scope.temp = "Follow Me";
	$scope.currentNavItem = 'page1';
	$scope.showGridBottomSheet = function() {
		$scope.alert = '';
		$mdBottomSheet.show({
			templateUrl : './views/templates/bottomSheet.html',
			controller : 'GridBottomSheetCtrl',
			clickOutsideToClose : true
		}).then(function(clickedItem) {

		});
	};
})

.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
	$scope.items = [ {
		name : 'Message Us',
		icon : 'message'
	}, {
		name : 'Contact Us',
		icon : 'phone'
	}, {
		name : 'Email Us',
		icon : 'email'
	}, {
		name : 'Create',
		icon : 'book'
	}, {
		name : 'Settings',
		icon : 'settings'
	}, {
		name : 'Add',
		icon : 'add'
	}, ];

	$scope.listItemClick = function($index) {
		var clickedItem = $scope.items[$index];
		$mdBottomSheet.hide(clickedItem);
	};
});