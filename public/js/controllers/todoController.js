angular.module('todoCtrl', []).controller(
		'todoController',
		function($scope, $routeParams, $rootScope, noteService, $http) {
			noteService.getMyNotes($routeParams.user).then(
					function(data, err) {
						$scope.parentId=data.data.user.todoList[$routeParams.nIndex]._id;
						$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
					})
			$scope.saveTaskToDB=function($index){
				if($scope.todo.tasks[$index].done == true){
					return;
				}
				$scope.todo.updated=new Date();
				$scope.todo.tasks[$index].done=!($scope.todo.tasks[$index].done);
				$scope.send={
						updated:$scope.todo.updated,
						done:$scope.todo.tasks[$index].done,
						todoIndex:$routeParams.index.toString(),
						taskIndex:$index.toString()
				}
				console.log($scope.send);
				console.log($routeParams.index )
				$http.put('/api/v1/notebooks/todo/update/'+$scope.parentId,
						$scope.send).success(
						function(data) {	
							console.log(data);
							noteService.getMyNotes($routeParams.user).then(
									function(data, err) {
										$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
										
									})
						}).error(function(data) {
				console.log(data);
				});
			}
		});