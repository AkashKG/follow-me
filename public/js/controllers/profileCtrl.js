angular.module('profileCtrl', []).controller(
		'profileController',
		function($scope, $mdBottomSheet, $mdDialog, $mdSidenav, $window, $http, noteService, $rootScope, dialogFactory, userService, $location) {
			userService.getUser().then(function(data,err){
				$rootScope.user = data.data.user;
				//console.log($rootScope.isLoggedIn);
				if($rootScope.user)
			// //console.log(data.data.user);
				noteService.getMyNotes($rootScope.user._id).then(function(data, err) {
					$rootScope.notebooks = data.data.user.todoList;
					//console.log(data.data);
				})
			})  
		
			$scope.gotoTodoList = function(id, $index){
				//console.log()
				$scope.nIndex = $scope.notebookIndex;
				$location.path('/profile/alltodos/' + $rootScope.user._id + '/' + $scope.nIndex + '/' + $index);
				//console.log(id);
			}
			$scope.showFromSidenav=function($index){
				$mdSidenav('right').toggle().then(function() {
					
				});
				$scope.showNotebook($index);
				
			}
			$scope.link={
					linkUrl:''
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
				//console.log($scope.link.linkUrl);
				if((todo && !$scope.todoData.tasks.length)||(todo && $scope.todoData.tasks[$scope.todoData.tasks.length-1].task!=todo))
				$scope.todoData.tasks.push({task:todo,done:false,link:$scope.link.linkUrl});
				else{
					//console.log("Error");
				}
					
					
			}
			$scope.addNewtodo=function(){
				$scope.todoDate = new Date();
				$scope.todoData.created=$scope.todoDate;
				$scope.todoData.updated=$scope.todoDate;
				//console.log($scope.todoData.deadline);
				//console.log($scope.todoData);
			
				$http.post('/api/v1/notebooks/newTodo/' + $rootScope.user._id + '/' + $scope.notebook._id,
						$scope.todoData).success(
								
						function(data) {
							$scope.todoData.title = '';
									$scope.todoData.description = '';
										$scope.todoData={
												title:'',
												description:'',
												tasks:[],
												created:'',
												updated:'',
												deadline:'',
												done:false
											};
										$scope.link='';
							$scope.hide();		
							noteService.getMyNotes($rootScope.user._id).then(function(data, err) {
								$rootScope.notebooks = data.data.user.todoList;
								$scope.showNotebook($scope.notebookIndex)
								// //console.log(data.data);
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
				//console.log("Entered Here");
				$scope.notebookIndex = $index;
				$scope.notebook = $scope.notebooks[$index];
				//console.log($scope.notebook);
			}
			$scope.addNewnote = function() {
				$scope.notebookData.date = new Date();
				//console.log($scope.notebookData.date);
				$http.post('/api/v1/notebooks/newnotebook/' + $rootScope.user._id,
						$scope.notebookData).success(
						function(data) {
							$scope.notebookData.title = '',
									$scope.notebookData.description = ''
							$scope.hide();
							noteService.getMyNotes($rootScope.user._id).then(function(data, err) {
								$rootScope.notebooks = data.data.user.todoList;
								// //console.log(data.data);
							})
						}).error(function(data) {
					// //console.log(data);
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
							if(id==$scope.notebook._id){
								$scope.notebook=null;
							}
							// //console.log(data.data);
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
					// //console.log(clickedItem);
					if (clickedItem.name == "Notebook") {
						// //console.log(clickedItem);
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
		// //console.log($index);
		$mdBottomSheet.hide(clickedItem);

	};
})
.controller('sidenavController', function ($scope, $timeout, $mdSidenav, $log, $location, $rootScope) {
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    $rootScope.checkOnProfileLogged=function(){
    	//console.log($rootScope.isLoggedIn);
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
     * Supplies a function that will continue to operate until the
     * time is up.
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
  });
