angular
		.module('todoCtrl', [])
		.controller(
				'todoController',
				function($scope, $routeParams, $rootScope, noteService, $http,
						$window, $mdDialog) {
					noteService
							.getMyNotes($routeParams.user)
							.then(
									function(data, err) {
										$scope.parentId = data.data.user.todoList[$routeParams.nIndex]._id;
										$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
									})
					$scope.openLink = function(link) {
						console.log(link);
						$window.open('//' + link, '_blank');
					}
					$scope.saveTaskToDB = function($index) {
						if ($scope.todo.tasks[$index].done == true) {
							return;
						}
						$scope.todo.updated = new Date();
						$scope.todo.tasks[$index].done = !($scope.todo.tasks[$index].done);
						$scope.send = {
							updated : $scope.todo.updated,
							done : $scope.todo.tasks[$index].done,
							todoIndex : $routeParams.index.toString(),
							taskIndex : $index.toString()
						}
						console.log($scope.send);
						console.log($routeParams.index);
						$http
								.put(
										'/api/v1/notebooks/todo/update/'
												+ $scope.parentId, $scope.send)
								.success(
										function(data) {
											console.log(data);
											noteService
													.getMyNotes(
															$routeParams.user)
													.then(
															function(data, err) {
																$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];

															})
										}).error(function(data) {
									console.log(data);
								});
					}
					$scope.newTaskDialog = function(ev) {
						$mdDialog.show({
							templateUrl : '/views/notebook/task.view.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							scope : $scope.$new(),
							clickOutsideToClose : true,
						});
					}
					$scope.taskData = {
						task : null,
						link : null,
						done : false
					}
					$scope.addNewtask = function() {
						console.log($scope.taskData);
						console.log($scope.todo._id);
						$scope.todoIndex = $routeParams.index.toString();
						$scope.updated = new Date();
						$scope.taskData.updated=$scope.updated;
						$http.post('/api/v1/newtodo/newtask/'+ $scope.todo._id + '/'+ $scope.todoIndex,
										$scope.taskData)
								.success(
										function(data) {
													console.log(data);
											$scope.todoData = null;
														$scope.hide();
											noteService
													.getMyNotes(
															$routeParams.user)
													.then(
															function(data, err) {
																$scope.parentId = data.data.user.todoList[$routeParams.nIndex]._id;
																$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
															})
										}).error(function(data) {

								});

					}
					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.hide = function() {
						$mdDialog.cancel();
					};

				});