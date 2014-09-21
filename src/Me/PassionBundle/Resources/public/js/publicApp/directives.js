'use strict';

annoncesApp.directive('colorbox', function($compile, $rootScope){
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
});

annoncesApp.directive('closeColorbox', function(){
  return {
    link: function(scope, element, attrs){
      element.click('bind', function(){
        $.colorbox.close();
      });
    }
  };
})