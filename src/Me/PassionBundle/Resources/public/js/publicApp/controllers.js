'use strict';

var annoncesControllers = angular.module('annoncesControllers', []);

// Header (base.html.twig)
annoncesControllers.controller('HeaderCtrl', ['$scope',
	function($scope){
		// asynchronous submission of email address to go here...
	}
]);

// Navigation (base.html.twig)
annoncesControllers.controller('NavCtrl', ['$scope', 'Data',
	function($scope, Data){
		// Get categories from Data service
		Data.categoriesAsync().then(function(categories){
			$scope.categories = categories;
		});
	}
]);

// List view (list.html)
annoncesControllers.controller('ListCtrl', ['$scope', 'Data', '$routeParams',
	function($scope, Data, $routeParams){
		// Get annonces from Data service
		Data.annoncesAsync().then(function(annonces){
			$scope.annonces = annonces;
		});

		Data.categoriesAsync().then(function(categories){
			$scope.categories = categories;
		});
		// Set category for filtering
		if($routeParams.category){
			$scope.category = $routeParams.category;
		}
	}
]);

// Single item view (annonce.html)
annoncesControllers.controller('AnnonceCtrl', ['$scope', 'Data', '$routeParams', '$location',
	function($scope, Data, $routeParams, $location){
		Data.annoncesAsync().then(function(annonces){
			// Get this page's annonce
			for (var i = 0, len = annonces.length; i < len; i++) {
				if(annonces[i].id === $routeParams.annonceId){
					$scope.annonce = annonces[i];
					break;
				}
			}

			// Set ID of annonce to be sent with message
			$scope.response = {
				"annonceId": $scope.annonce.id
			};

			// Send response message
			$scope.sendResponse = function(){
				if($scope.response.$invalid){
					$scope.formError = true;
				}
				else{
					// If no errors, redirect and close colorbox
					Data.responseAsync($scope.response).then(function(data){
						console.log('response submitted');
						$location.path(" ");
						$.colorbox.close();
					});
				}
			}
		});
	}
]);

// Submit an item
annoncesControllers.controller('DepotCtrl', ['$scope', 'Data', '$upload',
	function($scope, Data, $upload){
		Data.categoriesAsync().then(function(categories){
			$scope.categories = categories;
		});

		$scope.form = {
			"acceptConditions": "1",
			"user": {
				"contact": "1"
			}
		};

		$scope.onFileSelect = function($files){
			$scope.file = $files;
		}

		$scope.processForm = function(){
			if($scope.submitForm.$invalid){
				$scope.formError = true;
			}
			else{
				$scope.upload = $upload.upload({
					url: 'deposer-data',
					method: 'POST',
					data: {form: $scope.form},
					file: $scope.file
				})
				.then(function(){
					console.log('data sent')
				})
			}
		}
	}
]);