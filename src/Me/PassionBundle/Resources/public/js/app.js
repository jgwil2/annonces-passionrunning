'use strict';

var annoncesApp = angular.module('annoncesApp', [
	'annoncesControllers',
	'ngRoute'
]);

var DIR = '../bundles/mepassion/partials';

annoncesApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider){
		$locationProvider.html5Mode(true).hashPrefix('!');
		$routeProvider.
			when('/', {
				templateUrl: DIR + '/list.html',
				controller: 'ListCtrl'
			}).
			when('/:category', {
				templateUrl: DIR + '/list.html',
				controller: 'ListCtrl'
			}).
			when('/annonce/:annonceID', {
				templateUrl: DIR + '/annonce.html',
				controller: 'AnnonceCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);