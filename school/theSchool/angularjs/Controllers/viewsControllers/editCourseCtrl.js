angular.module("myApplication").controller("editCourseCtrl",["$scope","homeService","funcAndVarService","$state","$stateParams",
                                                        function($scope,homeService,funcAndVarService,$state,$stateParams){


    function init(){
    }

     $scope.courses = $stateParams.courses;
     $scope.course = funcAndVarService.assignThisObject($stateParams.course);
     $scope.students = $stateParams.students;
     $scope.numberOfStudents = $scope.students.length;
     $scope.thereIsNotStudents = funcAndVarService.arrayIsNull($stateParams.course.students);
     $scope.thereIsStudents = funcAndVarService.arrayIsNotNull($stateParams.course.students);
     $scope.deleteWarning = false;
     $scope.isSaveCourseChangesClicked = false;
     $scope.isDeleteTheCourseClicked = false;
     $scope.objName = "course";

     $scope.warningOfDelete = function(){
         $scope.deleteWarning = true;
     };

     $scope.deleteTheCourse = function(){
         $scope.isDeleteTheCourseClicked = true;
         homeService.deleteCourse($scope.course).then(function(res){
             $scope.courses.splice($scope.course.indexInCourses,1);
             $scope.numberOfCourses = $scope.courses.length;
             $state.go('School',{courses:$scope.courses,students:$scope.students});
             $state.go('School.numberOfStudentsView',{students:$scope.numberOfStudents,courses:$scope.numberOfCourses});
         },function(err){
             console.log("delete course err:" + err.data)
         });

     };

     $scope.dontDeleteTheCourse = function(){
         if($scope.isDeleteTheCourseClicked == true){return}
         $scope.deleteWarning = false;
         $state.go('School.editCourse',{course:$scope.course,courses:$scope.courses});
     };

     $scope.saveFieldsChanges = function(){
         homeService.updateCourse($scope.course).then(function(res){
             if(res.data=="one or more of the fields is missing"){
                 return
             }
             $scope.courses.splice($scope.course.indexInCourses,1,$scope.course);
             $state.go('School',{courses:$scope.courses,students:$scope.students});
             $state.go('School.courseView',{course:$scope.course,courses:$scope.courses,students:$scope.students});
         },function(err){
             console.log("update course err:" + err.data)
         });
     };

     $scope.saveCourseChanges = function(){
         if ($scope.form.file.$valid && $scope.file) {
             homeService.uploadCourseImage($scope.file,function(res){
                     $scope.course.image = res.data.path;
                     $scope.saveFieldsChanges();
                 }
             )}
         else{
             $scope.saveFieldsChanges();
         }
     };

    return init();

}]);

