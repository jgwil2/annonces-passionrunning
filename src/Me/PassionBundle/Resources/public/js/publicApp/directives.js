'use strict';

annoncesApp.directive('colorbox', ['$compile', '$rootScope', '$location',
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

annoncesApp.directive('closeColorbox', function(){
  return {
    link: function(scope, element, attrs){
      element.click('bind', function(){
        $.colorbox.close();
      });
    }
  };
});

annoncesApp.filter('regex', function() {
  return function(input, field, regex) {
    var patt = new RegExp(regex);      
    var out = [];
    for (var i = 0; i < input.length; i++){
    if(patt.test(input[i][field]))
      out.push(input[i]);
    }      
    return out;
  };
});