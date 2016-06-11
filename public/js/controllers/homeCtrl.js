angular.module('homeCtrl', [])

.controller('homeController', function ($scope, $window) {
    
    $scope.$parent.seo = { 
    	    title : 'fodo | take your task', 
    	    descripton: 'fodo, take your task wherever you go!' 
    	  }; 
    $scope.timeline=[{
    	title:"fodo.herokuapp.com",
    	link:'https://fodo.herokuapp.com',
    	description:"Individual project. A self tracking todo app."
    },{
    	title:"Book-barter",
    	link:'https://github.com/AkashKG/bookbars',
    	description:"Team Lead. Full stack developer"
    },{
    	title:"Edulimn",
    	link:"http://test.edulimn.com",
    	description:"Front End developer"
    		
    },{
    	title:"Angular Calculator",
    	link:"http://s.codepen.io/AkashKG/debug/ZQELoB",
    	description:"A simple Calculator- Focussed on UI"
    },{
    	title:"SRF-2015 Indian Academy",
    	description:"Real time task scheduling on heterogeneous multiprocessors."
    	
    }]
    $scope.show={
    		timeline:true,
    		existence:true,
    		existence_icon:'visibility_off',
    		timeline_icon:"visibility_off"
    		//existence-icon-color:''
    }
    
    $scope.toggleExistence=function(){
    	$scope.show.existence=!$scope.show.existence;
    	if($scope.show.existence_icon=='visibility_off'){
    		$scope.show.existence_icon='visibility_on';
    	}
    	else{
    		$scope.show.existence_icon='visibility_off';
    	}
    }
    $scope.toggleTimeline=function(){
    	$scope.show.timeline=!$scope.show.timeline;
    	if($scope.show.timeline_icon=='visibility_off'){
    		$scope.show.timeline_icon='visibility_on';
    	}
    	else{
    		$scope.show.timeline_icon='visibility_off';
    	}
    }
    $scope.existence=[{
    	title:'github.com/AkashKG',
    	link:'https://github.com/AkashKG',
    	icon:'link'
    },{
    	title:'linkedIn',
    	link:'https://linkedin.com/yesitsakash',
    	icon:'link'
    },{
    	title:'codepen.io/AkashKG',
    	link:'https://codepen.io/AkashKG',
    	icon:'link'
    },{
    	title:'quora',
    	link:'https://quora.com/akash-gupta-10',
    	icon:'link'
    }]
    $scope.openLink=function(url){
    	$scope.link=url;
    	$window.open(url,'_blank');
    }
    
    $scope.thingsILove=[{
    	name:'AngularJS',
    	icon:'http://ccoenraets.github.io/pgday14/images/angular-icon.png',
    	description:'AngularJS draw me into web development. I have worked on one major project and 3 minor project using it.'
    },{
    	name:'MongoDB',
    	icon:'http://blogs.msdn.com/cfs-filesystemfile.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-00-60-29-metablogapi/4846.mongodb_2D00_logo_5F00_thumb_5F00_3BA2A1E5.png',
    	description:'Certification Course - M101x: Introduction to mongoDB using MEAN stack.'
    },{
    	name:'NodeJS',
    	icon:'https://cdn2.iconfinder.com/data/icons/nodejs-1/128/nodejs-128.png',
    	description:'Used Express npm package while working with NodeJS in web development.'
    },]
    $scope.programming=[{
    	name:'C++',
    	icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABaCAMAAAAVSlG+AAAAulBMVEX///9mmtMARIEAWZ1fltGtvdKqw+EATpgAVpwAQoAAPX4AQH8AOnxbk9AAS5ZpndYAK3QAMXYAN3v2+vt0odIAR5Wis8aOobgAU5vs8/jBztxnjbV7ptM7b6jb5OxTicIARIoqYJobUY0AS4p1jKvI0tpNfbBTgK4bYJ/K2+2IsNizxNJAcaRAd7EeToTN3OdDZ5JVdJyFo8Kau95jfaAxW4t/lrF2mcG3zeMAHm52lrcqba0APZGatM4/HEoeAAAEf0lEQVRYhe2ZaXuiOhiGIURli6xaQU1PR+3UZVCH1sNMx///t06wqGQhxNZP55rnE4VwkzzvEqSa9ld/9b9Vsux2l8m9oTlCECLUje5JLXSonwT14m7QpVdBS6F4excoXiGdElp93eIoR1BnBL9s8cVUBqwvvwBdxkgEPTkxwZ+E4kkj9OTEpyyOcihcfw0MuzdTCz5SIvBtFm+bTf28xXJTmQmrWizKVLkTKhY3ZKoU3JrFyqbSklucsOV/mQ+6SLwWiPImi6Ou+B4I43yJE9IGogQXedw0StwoxKZC5BXMPHAXChcFY4HFuXAomgijUYhDgLgevxSNk4S4EJY2Ylp8JHz4StJWkwnH9fT3p/bJ8kui1aXv8bwfhjmgE63LLwm1tpGizvUeX0zD6HVasO3UOteD7wTajlWhXrie/sM8Uduwqh16BevQVmysRi0z6MNUJSxS3qbw4/vIMNSwMOdv764mk7zgGtVxZBqqWJ0tg0InL3akm0BE13360jMMVSw7WVzvAGhyMQh/75uGOpZxlqlACD+cSH4PRgYrGXZCXdpydX3iHkc8VIqFVC+IBJ0q1tKnvgAqxSIq3DmPJZnKmapgQj0PEs6CsvzPUHMwOKfCx5EEGzc+Tz9V6jVTzQ1OjhUX43VPhoWr+oWYXb9xXb452mjauvSDTJ/EdmDKsPWspQNGlb9hTjdjgp1uXsgReQAmRxJsvXklNSzZU+hCPaf3eHDewn4ObsWSPWXGRP0OWO9x5liAwo46KcHhNH3uH9OUjE3TsQRLdYQKip4cUIqacG8w1bTOHxKzXr9PQvanP5J4S9XuR/t/si1QqQ42n0nIqgQj8+6r5+0SEVOBA2qqxe1lPN5Uf47H3+U7L6QaWExMBbRmRu+MHo3oI1lPoDr12gec/M6moSnIZkt38X3IUoMDiZTRuxGrQ+pStHNparg/nf7ZEzRc6e7AvHrs6z44/rw6nYwHnBPSLZLeHjRt6IRV2OwgW1/Pb6dsM5diuTelaLjz/SDwg/2avtC5AevpzxqnCC8WmH/fTf5RxXqP3/wHnivW3J2ZKlgPlpUaLNSop6yetWI9fWqV5W8Bpc8muOoVMym2Vv72ToGbZJe6NpuxxNRr+bu7duqbXWsUorfxApamOtZ1GHDfWuabZDVq5UQvpYZgqE8paOkDkH5IS222sxFwn5nKv/wg4ATNeRbNfYu7Abi/2RUJsKSrgFQI1TquKxhuZ5xv2AkFj7eCtw7HjIZZIBybiX4bPIQ2PxY44a/XdXKZRYSH+1+iCQDXGYpXlrz6IidI2wqz3fyB6HWXBaF4jD9v/hmz3YkCUS7QsV0im82W82V/L/9w1QHcHtMqYmpDZGvxeAhEFkvkhg2mshYHQvvEsgOJqbQWb6IEEsnxd7d8cB1mKhZb1M6moujgt1rsBsfbP2a3Weyom0pLZrET3GQqrSEQ1uknTKUVHUSNwnWVd+Ym4T3bKBxZ+atrQbVBK9jd578vxOLQrcBWCL5kKq1oHpS7gXUHU2nhwzcLZAd1U/8DrRhjfSnzziUAAAAASUVORK5CYII=',
    	description:'The first programming language that I learnt. (Proficient) '
    },{
    	name:'Java',
    	icon:"data:image/png;base64,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",
    	description:'Learnt during the 4th semester of B.Tech course'
    },{
    	name:'javascript',
    	icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAulBMVEX////loijxvybs7e4AAADknxnuxo7koCjmpCjwuQDywSbuuCbxvh/loB8TExMFBwjzyFfs8vjkmgDnt2rc3d3++u7s6OD1z2v29vbCw8KioqLlpTPyxD3mrlP02rfrsCf++/bxz53nqT/67t713sD11YbtwoT55bjz1ar25cr103v88dbqtWKTlJT33ZtBQUFQUFDsv3n77MjyxkrozKb44Knr4NHq2cAgICBdXV2EhIRra2spKio4ODhwGU5SAAAEh0lEQVRYhe2YWXPiOBRGZYOITewmFusMAYwJS9IkHTqE0LP8/7812i2JYF1o98NU9feQSlWUU7ckHV3JCP3OdRmNRvyHSn3k52az+Qf61lT5qz70n80ORb92vog0n+tG/2gy7vFXoEdHxu6NGo0a51qgUePY+dLp1Mgt0ahBy27+WytboVGPsf+pi/pM80OhBfu1HrTYzB2++egvxyPbfH/Xgn6lWBaOlvu6U0/ZWkHTxm+1oHsqo/LXXq8W9O/8omxaV2fjQXcJvjKk60G3cHBlcMs3IdejfRMyrUTfnAlHTz3oB1JBjm7PJKJ/JA8e9KISHbY/D0cvPOi+gyZWYiehiED3PWjkoA8DM307XxWbF+EjO+iiYcUZm4cXoccmOZ1klej7RKDZFhl70ZPURG8r0eiNo9u3N6wKL3pnoXfV6DsDvfOiLdNxqxo9LNFezxGaW+h9NXop0DM2dO5FT80tgj8kMxNxB7+IZZzRqonPc4QeTTSR6EE0TrFQJnwbDpdLOXgdi6oZ+tGLtkwnA4E+ECk6TUIT52Lwd4GObgCeO6YTOR8fBpollhyhYzsAeY765jISsYrZHjvo73KwQDNjsB+dmzpiiZ676LUcHWsZi9yLRkXpTFpI9MpFv7votPCTTdOV51k3tdHJixzMNx/Qc4S2Bnol0RMX/SQHM9OF575+zrIq11F7XgQ2OgzvRUoZVwC0YTreSPT4BJ2IaBkBnls9XcuIU5HEjZbR289ZjJ6u0cVE5M5NKaOvn7MYhwg52KfTyfEklhHUz1kM09URcvZQ5ZsP2M9pcuMQafjQsUbnALTR0wsQmnvu7+cseoe4/fwU3ddoDEJr0/1ofqiCPae3d43eZU7coawVwD03TS+6ToYyd3LoWqFBnlvXhdSJkjCWQ1nbFTL6rwos5x8G6gxJ7uVQflngaN+TQKQ0fSyTuuihHDpUVYM8N0xPV1LzwkVbx3UEuyqw6OtC2pWdQHUHjVb3kLeLjhCjp6t9ne0cdCz7F78EQ/s5/wfd06XomdozGi0bej9RV4VxDkIjNbXBuGHdFUq0dQ3hVwUY2TB9oC5POC3RSawuTwuFBnpu9HR9Xg/2XULxEcMmy7Wa2NLzLRCtHwa6y7A2c5hP0nD4bq6X8DwAPQlEtOmqNyr8ILcHvsRKRpjnhul4X32oLvURAvPcuC7geVaJflIygq4KLKbpVW+Z/FLPzYcBDrb7QZZ9hv76fpeU/Rzmud3T6RMmXX0ovBzQXz/RV4186cL7OYvzCYDSJ60Do/NyX940VqOhZBctiie76WDxPqRYgxtCn/4qxQma4wm2ypW55Aixbu9WohPuhZ47nwDOo9vtdsg/O4E9P/+xz0JT7Cy4EesM9dz5BPAJmpU7i+RHuAD4JBCZks9nJOLFUuysxPL1hXpOnZnuiDz9HXS7fTuLAoPLd+VDDkazLOYTTJyJicxZCIRLc6jjdvEPK+wUb5Wbrh4vK9dOf7MN3OIZNuhuYPeD6uIfW2OjeMotWoufKdfBT7sMz7CXLhoki3kx2Vy1aP+n/AedDG6U5kzlFQAAAABJRU5ErkJggg==',
    	description:'Learnt basic Javascript from freecodecamp'
    },]
    $scope.educationSwitch=true;
  });

