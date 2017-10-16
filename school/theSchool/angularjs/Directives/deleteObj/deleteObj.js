
angular.module("myApplication").directive("deleteObj",function(){

  return {
    restrict:'E',
    templateUrl:'Directives/deleteObj/deleteObj.html',
      scope:{
            objName:'=',
            disableBool:'=',
            dontDeleteTheObj:'&',
            deleteTheObj:'&'
      }
  };
});