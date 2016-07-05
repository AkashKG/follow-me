angular
		.module('todoCtrl', [])
		.config(function($mdIconProvider) {
			$mdIconProvider.iconSet("avatars", 'icons/avatar-icons.svg', 128);
		})
		.controller(
				'todoController',
				function($scope, $routeParams, $rootScope, noteService, $http,
						$window, $mdDialog, dialogFactory, userService, $timeout) {

					userService
							.getUser()
							.then(
									function(data, err) {
										if (data != null) {
											$rootScope.user = data.data;
											noteService
													.getMyNotes()
													.then(
															function(data, err) {
																$scope.parentId = data.data.todoList[$routeParams.nIndex]._id;
																
																$scope.todo = data.data.todoList[$routeParams.nIndex].todos[$routeParams.index];
																// //console.log($scope.todo);
																$scope
																		.calculatePercentage();
															})
										}

									})
					
									
									
					$scope.reload = function(){
						noteService
						.getMyNotes()
						.then(
								function(data, err) {
									$scope.parentId = data.data.todoList[$routeParams.nIndex]._id;
									
									$scope.todo = data.data.todoList[$routeParams.nIndex].todos[$routeParams.index];
									// //console.log($scope.todo);
									$scope
											.calculatePercentage();
								})
								 $timeout(function(){
									 $scope.reload();
								 },30000)
						
					}
					
					$scope.reload();
					
					$scope.add = {
						solution : ''
					}
					$scope.openLink = function(link) {
						// //console.log(link);
						var http = "http";
						if(link.indexOf(http) == -1){
							link = "http://" + link;
						}
						$window.open(link, '_blank');
					}

					$scope.calculatePercentage = function() {
						// //console.log("Entered");
						var count = 0;
						if ($scope.todo.tasks.length == 0) {
							$scope.percent = 101;
							return;
						}
						for (var i = 0; i < $scope.todo.tasks.length; i++) {
							if ($scope.todo.tasks[i].done == true)
								count++;
						}
						if (count == 0) {
							$scope.percent = 0;
							return;
						}
						$scope.percent = (count / $scope.todo.tasks.length) * 100;
						// //console.log($scope.percent);
					}
					$scope.updateTask = {
						task : '',
						link : '',
						done: '',
						solution:'',
						video:'',
					}
					
					$scope.viewSolution=function(){
						$scope.hide();
						$mdDialog
						.show({
							templateUrl : '/views/notebook/solution.view.html',
							parent : angular.element(document.body),
							scope : $scope.$new(),
							clickOutsideToClose : true,
						});
					}
					$scope.openVideo = function(video){
						$scope.video = video;
						
						console.log($scope.video);
						$mdDialog
						.show({
							templateUrl : '/views/notebook/video.view.html',
							parent : angular.element(document.body),
							scope : $scope.$new(),
							clickOutsideToClose : true,
						});
					}
				
					$scope.updateIndex='';
					$scope.showUpdateTaskDialog = function($index, t) {
						$scope.updateTask = t;
					
						$scope.updateIndex = $index;
						$mdDialog
								.show({
									templateUrl : '/views/notebook/updateTask.view.html',
									parent : angular.element(document.body),
									scope : $scope.$new(),
									clickOutsideToClose : true,
								});
					}
				
					
					$scope.updateExistTask = function() {
						$scope.send = $scope.updateIndex;
						$scope.todoIndex = $routeParams.index.toString();
						$scope.updated = new Date();
						$http.put(
								'/api/v1/notebooks/todo/task/update/'
										+ $scope.send + '/' + $scope.todoIndex + '/' + $scope.parentId + '/' +$scope.updated,
								$scope.updateTask).success(function(data) {
							dialogFactory.showToast(data.success);
							$scope.hide();
							noteService
							.getMyNotes()
							.then(
									function(
											data,
											err) {
										$scope.todo = data.data.todoList[$routeParams.nIndex].todos[$routeParams.index];
										console.log($scope.todo)
										$scope
												.calculatePercentage();
									})
						}).error(function(data) {
							dialogFactory.showToast(data.error);
							
						});
					}
					$scope.savingSolution = "";
					var cacheSolution = function() {
						$scope.send = $scope.updateIndex;
						$scope.todoIndex = $routeParams.index.toString();
						$scope.updated = new Date();
						$scope.savingSolution = "Saving . . ."
						$http.put(
								'/api/v1/notebooks/todo/task/update/'
										+ $scope.send + '/' + $scope.todoIndex + '/' + $scope.parentId + '/' +$scope.updated,
								$scope.updateTask).success(function(data) {
									$scope.savingSolution = "Saved few moment back."
						}).error(function(data) {
							$scope.savingSolution = "Error while saving"
						});
					}
					
					
					var timeout = null;
					  var debounceSaveUpdates = function(newVal, oldVal) {
						    if (newVal != oldVal) {
						      if (timeout) {
						        $timeout.cancel(timeout)
						      }
						      timeout = $timeout(cacheSolution, 15000);  // 1000 = 1 second
						    }
					};
					$scope.$watch('updateTask.solution', debounceSaveUpdates)
					
					$scope.saveTaskToDB = function($index, t) {
					//	console.log(t);
						if ($scope.todo.tasks[$index].done == true) {
							$scope.updateIndex=$index;
							$scope.updateTask = t;
							$scope.viewSolution();
						}
						else{
						$scope.todo.updated = new Date();
						$scope.todo.tasks[$index].done = !($scope.todo.tasks[$index].done);
						$scope.send = {
							updated : $scope.todo.updated,
							done : $scope.todo.tasks[$index].done,
							todoIndex : $routeParams.index.toString(),
							taskIndex : $index.toString()
						}
						// //console.log($scope.send);
						// //console.log($routeParams.index);
						$http
								.put(
										'/api/v1/notebooks/todo/update/'
												+ $scope.parentId, $scope.send)
								.success(
										function(data) {
											dialogFactory
													.showToast(data.success);
											noteService
													.getMyNotes()
													.then(
															function(data, err) {
																noteService
																		.getMyNotes()
																		.then(
																				function(
																						data,
																						err) {
																					$scope.todo = data.data.todoList[$routeParams.nIndex].todos[$routeParams.index];
																					$scope
																							.calculatePercentage();
																				})
															})
										}).error(function(data) {

									dialogFactory.showToast(data.error);
									$scope.calculatePercentage();

								});
						$scope.calculatePercentage();
						}
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
						video: null,
						done : false,
						updated : null
					}
					$scope.addNewtask = function() {
						// //console.log($scope.taskData);
						// //console.log($scope.todo._id);
						$scope.todoIndex = $routeParams.index.toString();
						$scope.updated = new Date();
						$scope.taskData.updated = $scope.updated;
						$http
								.post(
										'/api/v1/newtodo/newtask/'
												+ $scope.todo._id + '/'
												+ $scope.todoIndex,
										$scope.taskData)
								.success(
										function(data) {
											dialogFactory
													.showToast(data.success);
											$scope.taskData = {
												task : null,
												link : null,
												done : false,
												video:null,
												updated : null
											}
											$scope.cancel();
											noteService
													.getMyNotes()
													.then(
															function(data, err) {
																$scope.cancel();
																if (err)
																	dialogFactory
																			.showToast(err);
																else {
																	$scope.todo = data.data.todoList[$routeParams.nIndex].todos[$routeParams.index];
																	$scope
																			.calculatePercentage();
																}
															})
											noteService
													.getMyNotes(
															$routeParams.user)
													.then(
															function(data, err) {
																$scope.cancel();
																if (err)
																	dialogFactory
																			.showToast("Cannot post");
																else {
																	$scope.todo = data.data.user.todoList[$routeParams.nIndex].todos[$routeParams.index];
																}
																$scope
																		.calculatePercentage();
															})
										}).error(function(data) {
									dialogFactory.showToast("Cannot post");
								});

					}
					$scope.cancel = function() {
						$mdDialog.cancel();
					};
					$scope.solution = ''
					$scope.hide = function() {
						$mdDialog.cancel();
					};

					$scope.addSolution = function($index, ev) {
						$scope.taskPos = $index;
						$mdDialog.show({
							templateUrl : '/views/notebook/solution.view.html',
							parent : angular.element(document.body),
							targetEvent : ev,
							scope : $scope.$new(),
							clickOutsideToClose : true,
						});
					}
					$scope.addSoln = function() {
						$scope.sol = $scope.add.solution;
						//console.log($scope.taskPos + $scope.add.solution);
						$http.post(
								'/api/v1/notebooks/todo/addsolution/'
										+ $scope.taskPos, $scope.sol).success(
								function(data) {
									dialogFactory.showToast(data.success);

								}).error(function(err) {
							dialogFactory.showToast(data.error);
						})
					}
					
					 
					 
					 
					  $scope.cmOption = {
					    lineNumbers: true,
					    indentWithTabs: true,
					    theme:'material',
					    mode:'javascript',
					    onLoad : function(_cm){
					      $scope.editor = _cm;
					        setTimeout(function(){
					            $scope.editor.refresh();
					        }, 100);
					    }
					  };

				});
