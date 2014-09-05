'use strict';

var annoncesControllers = angular.module('annoncesControllers', []);

annoncesControllers.controller('ListCtrl', ['$scope', 'Data', '$routeParams',
	function($scope, Data, $routeParams){
		// Get annonces from Data service
		Data.annoncesAsync().then(function(annonces){
			$scope.annonces = annonces;
		});

		Data.categoriesAsync().then(function(categories){
			$scope.categories = categories;
		});

		if($routeParams.category){
			$scope.category = $routeParams.category;
		}
}]);

annoncesControllers.controller('AnnonceCtrl', ['$scope', 'Data', '$routeParams',
	function($scope, Data, $routeParams){
		// Get annonces from Data service
		Data.annoncesAsync().then(function(annonces){
			for (var i = 0, len = annonces.length; i < len; i++) {
				if(annonces[i].id === $routeParams.annonceId){
					$scope.annonce = annonces[i];
					break;
				}
			}
		});
	}]);