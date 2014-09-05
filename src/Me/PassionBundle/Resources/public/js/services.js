angular.module('Data', []).factory('Data', function($http){
	var Data = {
		annoncesAsync: function(){
			var promise = $http.get('annonces-data', {cache: true}).then(function(response){
				return response.data;
			});
			return promise;
		},
		categoriesAsync: function(){
			var promise = $http.get('categories-data', {cache: true}).then(function(response){
				return response.data;
			});
			return promise;
		}
	}
	return Data;
});