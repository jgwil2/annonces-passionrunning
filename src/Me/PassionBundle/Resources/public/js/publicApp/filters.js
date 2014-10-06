"use strict";

var annoncesFilters = angular.module('annoncesFilters', []);

annoncesFilters.filter('startFrom', function() {
	return function(input, start) {
		if(input){
			return input.slice(start);
		}
	}
})