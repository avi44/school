angular.module("myApplication").controller("courseViewCtrl",["$scope","homeService","funcAndVarService","$state","$stateParams",function(
                                                                $scope,homeService,funcAndVarService,$state,$stateParams){


    function init(){
    }
$scope.course = $stateParams.course;
$scope.courses = $stateParams.courses;
$scope.students = $stateParams.students;
$scope.UserRole = JSON.parse(localStorage.getItem("userObject")).role;
$scope.isNotSales = ($scope.UserRole == "manager" || $scope.UserRole == "owner");



    $scope.editCourse = function () {
        $state.go('School.editCourse',{course:$scope.course,courses:$scope.courses,students:$scope.students});
    };

    $scope.studentsValue = funcAndVarService.arrayIsNotNull($scope.course.students);



    return init();


}]);

