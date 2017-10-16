angular.module("myApplication").controller("studentViewCtrl",["$scope","homeService","funcAndVarService","$rootScope","$state","$stateParams",
                                                        function($scope,homeService,funcAndVarService,$rootScope,$state,$stateParams){


    function init(){
    }
        $scope.student = $stateParams.student1;
        $scope.courses = $stateParams.courses;
        $scope.students = $stateParams.students;
    $scope.editStudent= function () {

            $state.go('School.editStudent',{student:$scope.student,courses:$scope.courses,students:$scope.students});
    };

$scope.coursesValue = funcAndVarService.arrayIsNotNull($scope.student.courses);


    return init();


}]);

