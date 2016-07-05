angular.module('profileCtrl', [])


.controller(
		'profileController',
		function($scope, $mdBottomSheet, $mdDialog, $mdSidenav, $timeout, $window, $http, noteService, $rootScope, dialogFactory, userService, $location) {
			userService.getUser().then(function(data,err){
				if(data!=null){
					$rootScope.user=data.data;
					noteService.getMyNotes().then(function(data,err){
						$scope.notebooks=data.data.todoList;
						$scope.calculateCompleted();
					})
					userService.getUserId().then(function(data,err){
						$scope.authorId=data.data.id;
					})
				}
				
			})  
			$scope.reload = function(){
						noteService.getMyNotes().then(function(data,err){
							$scope.notebooks=data.data.todoList;
							$scope.calculateCompleted();
						})
						 $timeout(function(){
							 $scope.reload();
						 },30000)
				
			}
			
			$scope.reload();
					$scope.comp = 0;
					$scope.len = 0;
			$scope.calculateCompleted=function(){
				var completed=0, length=0;
				if(!$scope.notebooks){
					$scope.comp = 0;
					$scope.len = 0;
					return 0;
				}
				for(var i=0;i<$scope.notebooks.length;i++){
					for(var j=0;j<$scope.notebooks[i].todos.length;j++){
						if(!$scope.notebooks[i].todos){
							continue;
						}
						for(var k=0;k<$scope.notebooks[i].todos[j].tasks.length;k++){
							if(!$scope.notebooks[i].todos[j].tasks){
								continue;
							}
							if($scope.notebooks[i].todos[j].tasks[k].done==true){
								completed = completed + 1;
								length = length + 1;
							}
							else
								length = length + 1;
						}
					}
				}
				$scope.comp = completed;
				$scope.len = length;
				$scope.data = [$scope.comp,$scope.len-$scope.comp];
		    }
			$scope.dashboard = true;
			$scope.showDashboard=function(){
				$scope.dashboard = true;
				$scope.notebook = null;
			}
			
			 $scope.labels = ["Done", "Left"];
			  $scope.data = [$scope.comp,$scope.len-$scope.comp];
			$scope.gotoTodoList = function(id, $index){
				// //console.log()
				$scope.nIndex = $scope.notebookIndex;
				$window.open('/profile/alltodos/' + $scope.nIndex + '/' + $index,'_blank');
				// //console.log(id);
			}
			$scope.showFromSidenav=function($index){
				$mdSidenav('right').toggle().then(function() {
					
				});
				$scope.showNotebook($index);
				
			}
			$scope.task={
					link:'',
					task:'',
					done:false
			}
			$scope.todoData={
				title:'',
				tasks:[],
				created:'',
				updated:'',
				deadline:'',
			}
			$scope.addTodoToList = function(){
				$scope.todoData.tasks.push($scope.task);
				$scope.task={
						link:'',
						task:'',
						done:false
				}
			}
			
			$scope.editNotebook=function(book){
			
				$scope.updateNotebook = {
						_id:book._id,
						title:book.title,
						description:book.description
				}
			
				$mdDialog
				.show({
					templateUrl : '/views/notebook/edit.view.html',
					parent : angular.element(document.body),
					scope : $scope.$new(),
					clickOutsideToClose : true,
				});
			}
			
			$scope.editTodo = function(t, $index){
				console.log(t);
				$scope.updateBasicTodo = {
						_id:t._id,
						index:$index,
						title:t.title,
						updated:new Date(),
						deadline:new Date(t.deadline),
						
				}
				// console.log($scope.updateBasicTodo);
				$mdDialog
				.show({
					templateUrl : '/views/notebook/edittodo.view.html',
					parent : angular.element(document.body),
					scope : $scope.$new(),
					clickOutsideToClose : true,
				});
			}
			$scope.updateTodoBasic = function(){
				$http.put('/api/v1/notebooks/todos/updateone/',$scope.updateBasicTodo)
				.success(function(data){
					$scope.hide();
					noteService.getMyNotes().then(function(data,err){
						$scope.notebooks=data.data.todoList;
						$scope.showNotebook($scope.notebookIndex)
					});
				})
				.error(function(data){
					console.log(data);
				})
			}
			
			$scope.updateExistNotebook=function(){
				// console.log($scope.updateNotebook)
				$http.put('/api/v1/notebooks/updateone',$scope.updateNotebook)
				.success(function(data){
					$scope.hide();
					noteService.getMyNotes().then(function(data,err){
						$scope.notebooks=data.data.todoList;
						$scope.showNotebook($scope.notebookIndex)
						
					});
				})
			}
			
			$scope.addNewtodo=function(){
				if($scope.task.task!=''){
					$scope.addTodoToList();
				}
				$scope.todoDate = new Date();
				if(!$scope.todoData.tasks.length){
					dialogFactory.showToast("Please add atleast one task.");
					return;
				}
				$scope.todoData.created=$scope.todoDate;
				$scope.todoData.updated=$scope.todoDate;
				// //console.log($scope.todoData.deadline);
				// //console.log($scope.todoData);
			
				$http.post('/api/v1/notebooks/newTodo/' + $scope.notebook._id,
						$scope.todoData).success(
						function(data) {
							dialogFactory.showToast(data.success);
							
										$scope.todoData={
												title:'',
												tasks:[],
												created:'',
												updated:'',
												deadline:'',
											};
										$scope.task={
												link:'',
												task:'',
												done:false
										}
							$scope.hide();		
							noteService.getMyNotes().then(function(data,err){
						$scope.notebooks=data.data.todoList;
						$scope.calculateCompleted();
						$scope.showNotebook($scope.notebookIndex)
					})
						}).error(function(data) {
				
				});
			}
			$scope.notebook = null;
			$scope.notebookData = {
					title : '',
					description : '',
					date:'',
					authorId: ''
				}
			// $scope.notebook=$scope.notebooks[0];
			$scope.showNotebook=function($index){
				// //console.log("Entered Here");
				$scope.dashboard=false
				$scope.notebookIndex = $index;
				
				$scope.notebook = $scope.notebooks[$index];
				
				// //console.log($scope.notebook);
			}
			$scope.addNewnote = function() {
				$scope.notebookData.date = new Date();
				$scope.notebookData.authorId=$scope.authorId;
				$http.post('/api/v1/notebooks/newnotebook',
						$scope.notebookData).success(
						function(data) {
							dialogFactory.showToast(data.done);
							$scope.calculateCompleted();
							$scope.notebookData = {
									title : '',
									description : '',
									date:'',
									authorId:''
							}
							$scope.hide();
							noteService.getMyNotes().then(function(data,err){
								$scope.notebooks=data.data.todoList;
							})
						}).error(function(data) {
							// console.log(data.error);
							$scope.hide();
							dialogFactory.showToast(data.error);
					// ////console.log(data);
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
					
					$http.delete('/api/v1/notebook/delete/'+id + '/' + $scope.authorId).success(function(data){
						dialogFactory.showToast(data.Deleted);
						noteService.getMyNotes().then(function(data,err){
								$scope.notebooks=data.data.todoList;
								$scope.calculateCompleted();
								if(id==$scope.notebook._id){
									$scope.notebook=null;
								}
							})
					}).error(function(err){
						dialogFactory.showToast(err.error);
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
					// ////console.log(clickedItem);
					if (clickedItem.name == "Notebook") {
						// ////console.log(clickedItem);
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
	}/*
		 * , { name : 'Settings', icon : 'settings' }
		 */];

	$scope.listItemClick = function($index) {
		var clickedItem = $scope.items[$index];
		// ////console.log($index);
		$mdBottomSheet.hide(clickedItem);

	};
})
.controller('sidenavController', function ($scope, $timeout, $mdSidenav, $log, $location, $rootScope) {
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    $rootScope.checkOnProfileLogged=function(){
    	// //console.log($rootScope.isLoggedIn);
    	if(!$scope.isOnProfile() && $rootScope.isLoggedIn)
    		return false
    	return true
    }
    $scope.loggedOut=function(){
    	if($rootScope.isLoggedIn)
    		return false;
    	return true;
    }
   
    /**
	 * Supplies a function that will continue to operate until the time is up.
	 */
    $scope.menu="menu"
    $scope.isOnProfile=function(){
    	if($location.path()=='/profile' && $rootScope.isLoggedIn==true){
    		if($scope.isOpenRight()){
    			$scope.menu = "close"
    		}
    		else{
    			$scope.menu = "menu"
    		}
    		return true;
    	}
    	return false;
    }
    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    
    function buildToggler(navID) {
      return debounce(function() {
          
          $mdSidenav(navID)
            .toggle()
            .then(function () {
            });
        }, 200);
    }
  })
.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
    
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })
.controller('resumeController', function($scope, userService){
	userService.getUserResume().then(function(data,err){
		console.log(data);
	})
	
	$scope.resume={
			username:'',
			author:'',
			basicInfo:{
				name:'',
				email:'',
				college:'',
				currentLocation:'',
				image:''
			},
			onlineExistence:[{
				name:'',
				url:''
			}],
			timeline:[{
				name:'',
				description:'',
				url:''
			}],
			education:{
				btech:{
					name:'',
					description:''
				},
				intermediate:{
					name:'',
					description:''
				},
				matric:{
					name:'',
					description:''
				}
			},
			technologyAdvanced:[{
				name:'',
				icon:'',
				description:''
			}],
			technologyBasic:[{
				name:'',
				icon:'',
				description:''
			}]
	}
});