angular.module('profileCtrl', []).controller(
		'profileController',
		function($scope, $mdBottomSheet, $mdDialog, $http, noteService, $rootScope, dialogFactory, userService) {
			noteService.getAllNotes().then(function(data, err) {
				$rootScope.notebooks = data.data.todos;
				console.log(data.data);
			})
			userService.getUser().then(function(data,err){
				$rootScope.user = data.data.user;
				console.log(data.data.user);
			})
			$scope.notebookData = {
					title : null,
					description : null,
					date:null
				}
			
			$scope.addNewnote = function() {
				$scope.notebookData.date = new Date();
				console.log($scope.notebookData.date);
				$http.post('/api/v1/notebooks/newnotebook/' + $rootScope.user._id,
						$scope.notebookData).success(
						function(data) {
							$scope.notebookData.title = '',
									$scope.notebookData.description = ''
							$scope.hide();
							noteService.getAllNotes().then(function(data, err) {
								$rootScope.notebooks = data.data.todos;
								console.log(data.data);
							})
						}).error(function(data) {
					console.log(data);
				})
			}
			$scope.deleteNote = function(id, ev){
				var confirm = $mdDialog.confirm()
				.title("Delete Book")
				.targetEvent(ev)
				.content('Are you sure to delete this notebook?')
				.ariaLabel('Delete')
				.ok("Delete")
				.cancel('Cancel');
				$mdDialog.show(confirm).then(function(ev) {
					$http.delete('/api/v1/notebook/delete/'+id).success(function(data){
						noteService.getAllNotes().then(function(data, err) {
							$rootScope.notebooks = data.data.todos;
						});
					});
				});
			}
			$scope.newBookDialog = function() {
				$mdDialog.show({
					templateUrl : '/views/notebook/newbook.view.html',
					parent : angular.element(document.body),
					scope : $scope.$new(),
					clickOutsideToClose : true,
				});
			}
			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			$scope.hide = function() {
				$mdDialog.cancel();
			};

			$scope.showGridBottomSheet = function() {
				$scope.alert = '';

				$mdBottomSheet.show({
					templateUrl : './views/templates/bottomSheet.html',
					controller : 'GridBottomSheetCtrl',
					clickOutsideToClose : true
				}).then(function(clickedItem) {
					console.log(clickedItem);
					if (clickedItem.name == "Add") {
						console.log(clickedItem);
						$scope.newBookDialog();
					}
				});
			};
		}).controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
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
		console.log($index);
		$mdBottomSheet.hide(clickedItem);

	};
});
;