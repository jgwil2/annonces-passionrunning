'use strict';

var annoncesApp = angular.module('annoncesApp', [
	'annoncesControllers',
	'ngRoute',
	'Data',
	'angularFileUpload',
	'Flash',
	'CustomCache'
]);

var DIR = '../bundles/mepassion/partials';
//PHOTO_DIR = '../../web/uploads/'

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
			when('/confirmation',{
				templateUrl: DIR + '/confirmer.html'
			}).
			when('/:category', {
				templateUrl: DIR + '/list.html',
				controller: 'ListCtrl'
			}).
			when('/annonce/:annonceId', {
				templateUrl: DIR + '/modifier.html',
				controller: 'ModifierCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}
]);