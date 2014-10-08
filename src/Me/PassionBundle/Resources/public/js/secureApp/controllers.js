'use strict';

var secureAnnoncesControllers = angular.module('secureAnnoncesControllers', []);

// Header (base.html.twig)
secureAnnoncesControllers.controller('HeaderCtrl', ['$scope', 'Data',
	function($scope, Data){

		$scope.user = {};

		$scope.sendEmail = function(){
			if($scope.emailForm.$invalid){
				$scope.formError = true;
			}
			else{
				// If no errors, redirect and close colorbox
				Data.submitAsync('email-data', $scope.user).then(function(response){
					$.colorbox.close();
				});
			}
		}
	}
]);

// Navigation (base.html.twig)
secureAnnoncesControllers.controller('NavCtrl', ['$scope', 'Data',
	function($scope, Data){
		// Get categories from Data service
		Data.retrieveAsync('categories-data').then(function(categories){
			$scope.categories = categories;
		});
	}
]);

// List view (list.html)
secureAnnoncesControllers.controller('ListCtrl', ['$scope', 'Data', '$routeParams',
	function($scope, Data, $routeParams){

		$scope.search = {};

		// Get annonces from Data service
		Data.retrieveAsync('annonces-data').then(function(annonces){
			$scope.annonces = annonces;
			// Add region to annonce
			for (var i = 0, j = annonces.length; i < j; i++) {
				annonces[i].region = annonces[i].code_postal.substr(0,2);
			};
		});

		Data.retrieveAsync('categories-data').then(function(categories){
			$scope.categories = categories;
		});

		// Set category for filtering
		if($routeParams.category){
			$scope.category = $routeParams.category;
		}

		// Set amount for filtering
		$scope.matchPrix = function(annonce){
			var prix = parseInt(annonce.prix);
			if($scope.search.minPrix && $scope.search.maxPrix){
				if(prix >= $scope.search.minPrix && prix <= $scope.search.maxPrix){
					return true;
				}
				return false;
			}
			else if($scope.search.minPrix && !$scope.search.maxPrix){
				if(prix >= $scope.search.minPrix){
					return true;
				}
				return false;
			}
			else if(!$scope.search.minPrix && $scope.search.maxPrix){
				if(prix <= $scope.search.maxPrix){
					return true;
				}
				return false;
			}
			else{
				return true;
			}
		}

		// Pagination
		$scope.currentPage = 0; 
		$scope.pageSize = 1;

		$scope.setCurrentPage = function(currentPage){
			$scope.currentPage = currentPage;
			window.scrollTo(0,0);
		}

		$scope.getNumberAsArray = function(num){
			return new Array(num)
		}

		$scope.getNumberOfPages = function(){
			if($scope.displayedAnnonces){
				if($scope.displayedAnnonces.length == 0){
					$scope.noArticles = true;
				}
		 		else{
					$scope.noArticles = false;
				}
				return Math.ceil($scope.displayedAnnonces.length/$scope.pageSize)
			}
		}

		$scope.getPagesInPagination = function(){
			if($scope.getNumberOfPages() < 4){
				return $scope.getNumberOfPages();
			}
			else if($scope.currentPage < 2 || $scope.currentPage == $scope.getNumberOfPages() - 1){
				return 3;
			}
			else{
				return $scope.currentPage + 2;
			}
		}

		$scope.prevPage = function(){
			if($scope.currentPage > 0){
				$scope.currentPage--;
				window.scrollTo(0,0);
			}
		}

		$scope.nextPage = function(){
			if($scope.currentPage < $scope.getNumberOfPages() - 1){
				$scope.currentPage++;
				window.scrollTo(0,0);
			}
		}
	}
]);

// Submit an item (depot.html)
secureAnnoncesControllers.controller('DepotCtrl', ['$scope', 'Data', '$upload', '$location',
	function($scope, Data, $upload, $location){
		$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
		Data.retrieveAsync('categories-data').then(function(categories){
			$scope.categories = categories;
		});

		$scope.form = {
			"acceptConditions": "1",
			"user": {
				"contact": "1"
			}
		};

		$scope.onFileSelect = function($files){
			$scope.file = $files;
		}

		$scope.formError = false;
		$scope.filesizeError = false;
		$scope.fileTypeError = false;
		$scope.loading = false;

		$scope.allowedFileTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png']

		$scope.processForm = function(){
			if($scope.loading){
				return;
			}
			if($scope.submitForm.$invalid){
				$scope.formError = true;
			}
			else if($scope.file && $scope.file[0].size > 500000){
				$scope.fileSizeError = true;
			}
			else if($scope.file && $scope.allowedFileTypes.indexOf($scope.file[0].type) < 0){
				$scope.fileTypeError = true;
			}
			else{
				$scope.loading = true;
				$scope.formError = false;
				$scope.filesizeError = false;
				$scope.fileTypeError = false;
				$scope.upload = $upload.upload({
					url: 'deposer-data',
					method: 'POST',
					data: {form: $scope.form},
					file: $scope.file
				})
				.then(
					function(response){
						$scope.loading = false;
						$location.path('depot-succes');
					}
				);
			}
		}
	}
]);

secureAnnoncesControllers.controller('MesAnnoncesCtrl', ['$scope', '$window', 'Data',
	function($scope, $window, Data){
		// Get user id
		$scope.user = $window.user;

		// Get annonces from Data service
		Data.retrieveAsync('annonces-data').then(
			function(annonces){
				$scope.annonces = annonces;
			}
		);

		Data.retrieveAsync('categories-data').then(
			function(categories){
				$scope.categories = categories;
			}
		);
	}
]);

// Single annonce (respond or modify depending on ownership)
secureAnnoncesControllers.controller('ModifierCtrl', ['$scope', 'Data', '$routeParams', '$upload', '$window', 'Flash', 'CustomCache', '$location',
	function($scope, Data, $routeParams, $upload, $window, Flash, CustomCache, $location){
		Data.retrieveAsync('categories-data').then(function(categories){
			$scope.categories = categories;
		});

		Data.retrieveAsync('annonces-data').then(function(annonces){
			// Get this page's annonce
			for (var i = 0, len = annonces.length; i < len; i++) {
				if(annonces[i].id === $routeParams.annonceId){
					$scope.annonce = annonces[i];

					// Check if this annonce belongs to current user
					if($scope.annonce.user == $window.user){
						$scope.userAnnonce = true;
					}
					else{
						$scope.otherAnnonce = true;
					}

					$scope.form = {
							"acceptConditions": "1",
							"deletePhoto": "0",
							"code": annonces[i].code_postal,
							"ville": annonces[i].ville,
							"category": {
								"name": annonces[i].category
							},
							"titre": annonces[i].titre,
							"texte": annonces[i].texte,
							"prix": annonces[i].prix,
							"tel": annonces[i].tel
						};

					// Set ID of annonce to be sent with message
					$scope.response = {
						"annonceId": $scope.annonce.id
					};

					$scope.form.id = annonces[i].id;
					$scope.form.category = annonces[i].category_id
					break;
				}
			}

			// Send response message
			$scope.sendResponse = function(){
				if($scope.response.$invalid){
					$scope.formError = true;
				}
				else{
					// If no errors, redirect and close colorbox
					Data.submitAsync('reponse-data', $scope.response).then(
						function(data){
							$.colorbox.close();
							Flash.showMessage(response.data.message);
						}
					);
				}
			}
		});

		$scope.onFileSelect = function($files){
			$scope.file = $files;
		}

		$scope.modify = false;

		$scope.toggleView = function(){
			$scope.modify = $scope.modify ? false : true;
		}

		$scope.formError = false;
		$scope.filesizeError = false;
		$scope.fileTypeError = false;
		$scope.loading = false;

		$scope.allowedFileTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png']

		$scope.processForm = function(){
			if($scope.loading){
				return;
			}
			if($scope.submitForm.$invalid){
				$scope.formError = true;
			}
			else if($scope.file && $scope.file[0].size > 500000){
				$scope.fileError = true;
			}
			else if($scope.file && $scope.allowedFileTypes.indexOf($scope.file[0].type) < 0){
				$scope.fileTypeError = true;
			}
			else if($scope.file){
				$scope.loading = true;
				$scope.formError = false;
				$scope.filesizeError = false;
				$scope.fileTypeError = false;
				$scope.upload = $upload.upload({
					url: 'modifier-data',
					method: 'POST',
					data: {form: $scope.form},
					file: $scope.file
				})
				.then(
					function(response){
						$scope.loading = false;
						CustomCache.removeAll();
						$location.path('modification-succes');
					}
				);
			}
			else{
				$scope.loading = true;
				$scope.formError = false;
				$scope.filesizeError = false;
				$scope.fileTypeError = false;
				$scope.upload = $upload.upload({
					url: 'modifier-data',
					method: 'POST',
					data: {form: $scope.form},
				})
				.then(
					function(response){
						$scope.loading = false;
						CustomCache.removeAll();
						$location.path('modification-succes');
					}
				);
			}
		}

		$scope.confirmDelete = function(){
			Data.deleteAsync('supprimer-data/' + $scope.form.id).then(
				function(response){
					CustomCache.removeAll();
					$.colorbox.close();
					$location.path('suppression-succes');
				}
			);
		}
	}
]);