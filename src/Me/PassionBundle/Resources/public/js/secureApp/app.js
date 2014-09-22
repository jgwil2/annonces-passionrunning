'use strict';

var annoncesApp = angular.module('annoncesApp', [
	'annoncesControllers',
	'ngRoute',
	'Data',
	'angularFileUpload',
	'Flash'
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
	}
]);

// Clear flash messages on route change
annoncesApp.run(['$rootScope', '$location', 'Flash',
	function($rootScope, $location, Flash){
		$rootScope.$on('$routeChangeStart', function(event, next, current){
			Flash.clearMessage();
		})
	}
]);