angular.module("myApplication").controller("SchoolCtrl",["$scope","homeService","funcAndVarService","$state","$stateParams",
                                                function($scope,homeService,funcAndVarService,$state,$stateParams){


    function init(){

    }
    funcAndVarService.ifReloadPage();
    $scope.isNotOnClientInformation = true;
    $scope.newStudents = $stateParams.students1;
    if($scope.newStudents==null){

        $scope.getStudents = function(){
            homeService.getStudents().then(function(res){
                if(res.data!="user unauthorized"){
                    $scope.students = res.data;
                    $scope.numberOfStudents = res.data.length;
                    $scope.getCourses();
                }
            },function(err){
                console.log(err)
            })
        };

        $scope.getCourses = function(){
            homeService.getCourses().then(function(res){
                if(res.data!="user unauthorized") {
                    $scope.courses = res.data;
                    $scope.numberOfCourses = res.data.length;
                    $state.go('School.numberOfStudentsView',{students:$scope.numberOfStudents,courses:$scope.numberOfCourses});
                }
            },function(err){
                console.log(err)
            })
        };

        $scope.getStudents();
    }
    else{
        $scope.isNotOnClientInformation = false;
        $scope.students = Object.assign([],$scope.newStudents) ;
        $scope.courses = $stateParams.courses1;
    }

    $scope.goToAddStudent = function(){
        $state.go('School.addStudent',{students:$scope.students,courses:$scope.courses});

    };
    $scope.goToAddCourse = function(){
        $state.go('School.addCourse',{students:$scope.students,courses:$scope.courses});

    };

        $scope.showStudent = function (student,courses,index) {
                student.indexInStudents = index;
                $state.go('School.studentView',{student1:student,courses:courses, students:$scope.students});
    };

    $scope.showCourse = function(course,courses,index){
        course.indexInCourses  = index;
            $state.go('School.courseView',{course:course,courses:courses,students:$scope.students});
    };


    return init();


}]);
