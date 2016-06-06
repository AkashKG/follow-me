angular.module('todoCtrl', []).controller(
		'todoController',
		function($scope, $routeParams, $rootScope, noteService, $http) {
			noteService.getMyNotes($routeParams.user).then(
					function(data, err) {
						$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
						
					})
			$scope.saveTaskToDB=function($index){
				if($scope.todo.tasks[$index].done == true){
					return;
				}
				$scope.todo.updated=new Date();
				$scope.todo.tasks[$index].done=!($scope.todo.tasks[$index].done);
				console.log($scope.todo);
			}
		});