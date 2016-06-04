angular
		.module(
				'todoApp',
				[ 'ngRoute', 'ngMaterial', 'ngAria', 'ngMessages', 'appRoutes',
						'homeCtrl', 'loginCtrl', 'profileCtrl' ])

		.factory(
				'dialogFactory',
				[
						'$mdDialog',
						'$mdToast',
						function($mdDialog, $mdToast) {
							return {
								showBookDialog : function() {
									$mdDialog
											.show({
												controller : 'ShowbookController',
												templateUrl : '/views/showbook/showbook.view.html',
												clickOutsideToClose : true,
											});
								},
								showToast : function(text) {
									var toast = $mdToast.simple().content(text)
											.action('OK')
											.highlightAction(false).hideDelay(
													30000).position("top");
									$mdToast.show(toast).then(
											function(response) {
												if (response == 'ok') {
													debugger;
												}
											});
								},
								showAlert : function(title, content) {
									$mdDialog.show($mdDialog.alert()
											.clickOutsideToClose(true).title(
													title).content(content)
											.ariaLabel('Alert Dialog Demo').ok(
													'Got it!'));
								}
							}
						} ])
		.service(
				'noteService',
				[
						'$http',
						'$rootScope',
						'$location',
						function($http, $rootScope, $location) {
							return {
								getAllNotes : function() {
									return $http
											.get('/api/v1/notebooks/all')
											.success(function(data) {
												return data;
											})
											.error(
													function(data, status) {
														if (status = status.UNAUTHORIZED) {
															return null;
														}
													});
								},

								getMyNotes : function(id) {
									return $http.get('api/v1/notebooks/mybooks/'+id).success(
											function(data) {
												return data;
											}).error(function(data, status) {
										if (status = status.UNAUTHORIZED) {
											return null
										}
									});

								}
							}
						} ])

		.filter('reverse', function() {
			return function(items) {
				if (items)
					return items.slice().reverse();
			};
		})

		.service(
				'userService',
				[
						'$q',
						'$http',
						'$rootScope',
						'$location',
						function($q, $http, $rootScope, $location) {
							return {
								getUser : function() {
									return $http.get('api/v1/me').success(
											function(data) {

												return data;
											}).error(function(data, status) {
										if (status = status.UNAUTHORIZED) {
											return null
										}
									});
								}
							};
						} ]);
