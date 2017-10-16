angular.module("myApplication").controller("numberOfStudentsViewCtrl",["$scope","homeService","$rootScope","$state","$stateParams",
                                                              function($scope,homeService,$rootScope,$state,$stateParams){


    function init(){
    }
        $scope.numberOfStudents = $stateParams.students;
        $scope.numberOfCourses = $stateParams.courses;
    return init();


}]);

