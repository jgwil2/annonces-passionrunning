'use strict';

angular.module('Flash', []).factory('Flash', ['$rootScope',
	function($rootScope){
		var Flash = {
			showMessage: function(message){
				$rootScope.flash = message;
			},
			clearMessage: function(){
				$rootScope.flash = "";
			}
		};
		return Flash;
	}
]);

angular.module('Data', []).factory('Data', ['$http', 'Flash',
	function($http, Flash){
		var Data = {
			retrieveAsync: function(url){
				var promise = $http.get(url, {cache: true})
					.then(function(response){
						Flash.showMessage(response.data.message);
						return response.data;
					});
				return promise;
			},
			submitAsync: function(url, data){
				var promise = $http.post(url, data)
					.then(function(response){
						Flash.showMessage(response.data.message);
						return response.data;
					});
				return promise;
			}
		};
		return Data;
	}
]);