
angular.module("myApplication").controller("numberOfAdminsCtrl",["$scope","homeService","$rootScope","$state","$stateParams",
                                                                      function($scope,homeService,$rootScope,$state,$stateParams){


    function init(){
    }

        $scope.numberOfAdmins = $stateParams.numberOfAdmins;

    return init();


}]);

