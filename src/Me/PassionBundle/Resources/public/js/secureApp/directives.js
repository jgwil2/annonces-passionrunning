'use strict';

secureAnnoncesApp.directive('colorbox', ['$compile', '$rootScope', '$location',
  function($compile, $rootScope, $location){
    return {
      link: function(scope, element, attrs){
        element.click('bind', function(){
          $.colorbox({
            href: attrs.colorbox,
            onComplete: function(){
              $rootScope.$apply(function(){
                var content = $('#cboxLoadedContent');
                $compile(content)($rootScope);      
              })
            }
          });
        });
      }
    };
  }
]);

secureAnnoncesApp.directive('closeColorbox', function(){
  return {
    link: function(scope, element, attrs){
      element.click('bind', function(){
        $.colorbox.close();
      });
    }
  };
});