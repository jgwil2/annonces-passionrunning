'use strict';

angular.module('Data', []).factory('Data', function($http){
	var Data = {
		retrieveAsync: function(url){
			var promise = $http.get(url, {cache: true}).then(function(response){
				return response.data;
			});
			return promise;
		},
		submitAsync: function(url, data){
			var promise = $http.post(url, data).then(function(response){
				return response.data;
			});
			return promise;
		}
	}
	return Data;
});