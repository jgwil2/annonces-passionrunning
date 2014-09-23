'use strict';

var secureAnnoncesApp = angular.module('secureAnnoncesApp', [
	'secureAnnoncesControllers',
	'ngRoute',
	'Data',
	'angularFileUpload',
	'Flash'
]);

var DIR = '../bundles/mepassion/partials';
//PHOTO_DIR = '../../web/uploads/'

secureAnnoncesApp.config(['$routeProvider', '$locationProvider',
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
			when('/mesannonces', {
				templateUrl: DIR + '/mesannonces.html',
				controller: 'MesAnnoncesCtrl'
			}).
			when('/mesannonces/:annonceId', {
				templateUrl: DIR + '/modifier.html',
				controller: 'ModifierCtrl'
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
secureAnnoncesApp.run(['$rootScope', '$location', 'Flash',
	function($rootScope, $location, Flash){
		$rootScope.$on('$routeChangeStart', function(event, next, current){
			Flash.clearMessage();
		})
	}
]);