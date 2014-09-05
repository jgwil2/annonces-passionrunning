'use strict';

var annoncesControllers = angular.module('annoncesControllers', []);

// Navigation (base.html.twig)
annoncesControllers.controller('NavCtrl', ['$scope', 'Data',
	function($scope, Data){
		// Get categories from Data service
		Data.categoriesAsync().then(function(categories){
			$scope.categories = categories;
		});
	}]);

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
	}]);

// Single item view (annonce.html)
annoncesControllers.controller('AnnonceCtrl', ['$scope', 'Data', '$routeParams',
	function($scope, Data, $routeParams){
		Data.annoncesAsync().then(function(annonces){
			// Get this page's annonce
			for (var i = 0, len = annonces.length; i < len; i++) {
				if(annonces[i].id === $routeParams.annonceId){
					$scope.annonce = annonces[i];
					break;
				}
			}
		});
	}]);

// Submit an item
annoncesControllers.controller('DepotCtrl', ['$scope', 'Data',
	function($scope, Data){
		Data.categoriesAsync().then(function(categories){
			$scope.categories = categories;
		});

		$scope.form = {};
		$scope.form.user = {};

		$scope.form.acceptConditions = "1";
		$scope.form.user.contact = "1";

		$scope.processForm = function(){
			Data.submitAsync($scope.form).then(function(data){
				console.log('data submitted')
			});
		}
	}]);