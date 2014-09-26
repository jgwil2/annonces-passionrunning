'use strict';

angular.module('Flash', []).factory('Flash', ['$rootScope',
	function($rootScope){
		var Flash = {
			showMessage: function(message){
				if(message){
					$rootScope.flash = message;
					window.scrollTo(0,0);
				}
			},
			clearMessage: function(){
				$rootScope.flash = "";
			}
		};
		return Flash;
	}
]);

angular.module('CustomCache', []).factory('CustomCache', ['$cacheFactory',
	function($cacheFactory){
		return $cacheFactory('customData');
	}
]);

angular.module('Data', []).factory('Data', ['$http', 'Flash', 'CustomCache',
	function($http, Flash, CustomCache){
		var Data = {
			retrieveAsync: function(url){
				var promise = $http.get(url, {cache: CustomCache})
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
			},
			deleteAsync: function(url){
				var promise = $http.delete(url)
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