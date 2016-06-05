angular.module('profileCtrl', []).controller(
		'profileController',
		function($scope, $mdBottomSheet, $mdDialog, $window, $http, noteService, $rootScope, dialogFactory, userService) {
			userService.getUser().then(function(data,err){
				$rootScope.user = data.data.user;
				console.log($rootScope.isLoggedIn);
				if($rootScope.user)
			// console.log(data.data.user);
				noteService.getMyNotes($rootScope.user._id).then(function(data, err) {
					$rootScope.notebooks = data.data.user.todoList;
					console.log(data.data);
				})
			})
			$scope.gotoTodoList = function(id, $index){
				console.log()
				$scope.nIndex = $scope.notebookIndex;
				$window.open('/profile/alltodos/' + $rootScope.user._id + '/' + $scope.nIndex + '/' + $index ,'_blank');
				console.log(id);
			}
			
			$scope.todoData={
				title:'',
				description:'',
				tasks:[],
				created:'',
				updated:'',
				deadline:'',
				done:false
			}
			$scope.addTodoToList = function(todo){
				if((todo && !$scope.todoData.tasks.length)||(todo && $scope.todoData.tasks[$scope.todoData.tasks.length-1].task!=todo))
				$scope.todoData.tasks.push({task:todo,done:false});
				else
					dialogFactory.showToast("Invalid Input : Two todos cannot be same or cannot be empty");
					
			}
			$scope.addNewtodo=function(){
				$scope.todoDate = new Date();
				$scope.todoData.created=$scope.todoDate;
				$scope.todoData.updated=$scope.todoDate;
				console.log($scope.todoData.deadline);
				console.log($scope.todoData);
				$http.post('/api/v1/notebooks/newTodo/' + $rootScope.user._id + '/' + $scope.notebook._id,
						$scope.todoData).success(
						function(data) {
							$scope.todoData.title = '',
									$scope.todoData.description = ''
							$scope.hide();		
							noteService.getMyNotes($rootScope.user._id).then(function(data, err) {
								$rootScope.notebooks = data.data.user.todoList;
								
								// console.log(data.data);
							})
						}).error(function(data) {
				
				});
			}
			$scope.notebook = null;
			$scope.notebookData = {
					title : null,
					description : null,
					date:null
				}
			// $scope.notebook=$scope.notebooks[0];
			$scope.showNotebook=function($index){
				$scope.notebookIndex = $index;
				$scope.notebook = $scope.notebooks[$index];
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
							noteService.getMyNotes($rootScope.user._id).then(function(data, err) {
								$rootScope.notebooks = data.data.user.todoList;
								// console.log(data.data);
							})
						}).error(function(data) {
					// console.log(data);
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
					$http.delete('/api/v1/notebook/delete/'+id + '/' + $rootScope.user._id).success(function(data){
						noteService.getMyNotes($rootScope.user._id).then(function(data, err) {
							$rootScope.notebooks = data.data.user.todoList;
							// console.log(data.data);
						})
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
			$scope.newTodoDialog = function() {
				$mdDialog.show({
					templateUrl : '/views/notebook/todo.view.html',
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
					// console.log(clickedItem);
					if (clickedItem.name == "Notebook") {
						// console.log(clickedItem);
						$scope.newBookDialog();
					}
					else if(clickedItem.name=="Create Todo"){
						if(!$scope.notebook)
							dialogFactory.showAlert("Select Notebook","First select or create any notebook to create todo!")
						else
							$scope.newTodoDialog();
					}
				});
			};
		}).controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
	$scope.items = [ {
		name : 'Notebook',
		icon : 'add'
	},  {
		name : 'Create Todo',
		icon : 'book'
	}, {
		name : 'Settings',
		icon : 'settings'
	}];

	$scope.listItemClick = function($index) {
		var clickedItem = $scope.items[$index];
		// console.log($index);
		$mdBottomSheet.hide(clickedItem);

	};
});
;