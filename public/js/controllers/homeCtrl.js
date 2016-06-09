angular.module('homeCtrl', [])
.controller('homeController', function ($scope) {
    
    $scope.$parent.seo = { 
    	    title : 'fodo | take your task', 
    	    descripton: 'fodo, take your task wherever you go!' 
    	  }; 
  });

