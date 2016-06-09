angular
		.module('todoCtrl', [])
		.config(function($mdIconProvider) {
			$mdIconProvider.iconSet("avatars", 'icons/avatar-icons.svg', 128);
		})
		.controller(
				'todoController',
				function($scope, $routeParams, $rootScope, noteService, $http,
						$window, $mdDialog, dialogFactory, userService) {

					userService.getUser().then(function(data,err){
						$rootScope.user = data.data.user;
					})  
					noteService
							.getMyNotes($routeParams.user)
							.then(
									function(data, err) {
										$scope.parentId = data.data.user.todoList[$routeParams.nIndex]._id;
										$scope.author = data.data.user.todoList[$routeParams.nIndex]._id;
										$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
										$scope.calculatePercentage();
									})
					$scope.openLink = function(link) {
						console.log(link);
						$window.open('//' + link, '_blank');
					}

					$scope.calculatePercentage = function() {
						console.log("Entered");
						var count = 0;
						if ($scope.todo.tasks.length == 0) {
							$scope.percent = 101;
							return;
						}
						for (var i = 0; i < $scope.todo.tasks.length; i++) {
							if ($scope.todo.tasks[i].done == true)
								count++;
						}
						if(count==0){
							$scope.percent=0;
							return;
						}
						$scope.percent = (count / $scope.todo.tasks.length) * 100;
						console.log($scope.percent);
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
												+ $scope.parentId + '/' + $scope.author, $scope.send)
								.success(
										function(data) {
											dialogFactory.showToast(data.success);
											noteService
													.getMyNotes(
															$routeParams.user)
													.then(
															function(data, err) {
																$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
																$scope
																		.calculatePercentage();
															})
										}).error(function(data) {
									
									dialogFactory.showToast(data.error);
									$scope.calculatePercentage();
									$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
									
								});
						$scope.calculatePercentage();
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
						done : false,
						updated:null
					}
					$scope.addNewtask = function() {
						console.log($scope.taskData);
						console.log($scope.todo._id);
						$scope.todoIndex = $routeParams.index.toString();
						$scope.updated = new Date();
						$scope.taskData.updated = $scope.updated;
						$http
								.post(
										'/api/v1/newtodo/newtask/'
												+ $scope.todo._id + '/'
												+ $scope.todoIndex +'/' + $rootScope.user._id,
										$scope.taskData)
								.success(
										function(data) {
											dialogFactory.showToast(data.success);
											$scope.taskData = {
													task : null,
													link : null,
													done : false,
													updated:null
												}
											$scope.cancel();
											noteService
													.getMyNotes(
															$routeParams.user)
													.then(
															function(data, err) {
																$scope.cancel();
																if(err)
																dialogFactory.showToast(err);
																
																$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
																$scope.calculatePercentage();
															})
										}).error(function(data) {
											dialogFactory.showToast(data);
								});

					}
					$scope.cancel = function() {
						$mdDialog.cancel();
					};

					$scope.hide = function() {
						$mdDialog.cancel();
					};

				});