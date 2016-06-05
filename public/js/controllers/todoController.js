angular.module('todoCtrl', []).controller(
		'todoController',
		function($scope, $routeParams, $rootScope, noteService) {
			noteService.getMyNotes($routeParams.user).then(
					function(data, err) {
						$rootScope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
						console.log($rootScope.todo);
					})
		});