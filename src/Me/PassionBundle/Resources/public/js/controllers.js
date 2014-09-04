'use strict';

var annoncesControllers = angular.module('annoncesControllers', []);

annoncesControllers.controller('ListCtrl', ['$scope', '$http', 
	function($scope, $http){
		$http.get('data').success(function(response){
			console.log(response)
			$scope.annonces = response;
		})
}]);