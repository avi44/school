angular.module("myApplication").controller("addCourseCtrl",["$scope","homeService","$state","$stateParams", function($scope,homeService,$state,$stateParams){


    function init(){
    }
    $scope.courses = $stateParams.courses;
    $scope.students = $stateParams.students;
    $scope.course = {};
    $scope.course.name = '';
    $scope.course.students = [];
    $scope.course.description = '';
    $scope.imageNotSelected = false;

    $scope.imageSelected  = function(){
        $scope.imageNotSelected = false;
    };

    $scope.addCourse = function(){
        if ($scope.form.file.$valid && $scope.file) {
            homeService.addCourse($scope.file,$scope.course,function(res){
                if(res.data=="one or more of the fields is missing"){
                    return
                }
                $scope.course.image = res.data.path;
                $scope.course.id = res.data.rows.insertId;
                $scope.course.indexInCourses = $scope.courses.length;
                $scope.courses.push($scope.course);
                $state.go("School",{students1:$scope.students,courses1:$scope.courses});
                $state.go("School.courseView",{course:$scope.course,courses:$scope.courses,students:$scope.students});
                }

            )}
            else{
            $scope.imageNotSelected = true;
        }
    };
    return init();


}]);

