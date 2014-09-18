'use strict';

var annoncesApp = angular.module('annoncesApp', [
	'annoncesControllers',
	'ngRoute',
	'Data',
	'angularFileUpload'
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
			when('/depot',{
				templateUrl: DIR + '/depot.html',
				controller: 'DepotCtrl'
			}).
			when('/:category', {
				templateUrl: DIR + '/list.html',
				controller: 'ListCtrl'
			}).
			when('/annonce/:annonceId', {
				templateUrl: DIR + '/annonce.html',
				controller: 'AnnonceCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);