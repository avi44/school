angular.module("myApplication").controller("addStudentCtrl",["$scope","homeService","funcAndVarService","$state","$stateParams",
                                                        function($scope,homeService,funcAndVarService,$state,$stateParams){


    function init(){
    }
     $scope.courses = $stateParams.courses;
     $scope.students = $stateParams.students;
     $scope.student = {};
     $scope.student.name = '';
     $scope.student.phone = '';
     $scope.student.email = '';
     $scope.student.courses = [];
     $scope.coursesIdsOfStudent = [];
     $scope.objectForValueOfCheckbox = {};

     $scope.newCourse = function(obj){
         this.name = obj.name;
         this.id = obj.id;
         this.description = obj.description;
         this.image = obj.image;
     };
     $scope.imageNotSelected = false;

     $scope.imageSelected  = function(){
         $scope.imageNotSelected = false;
     };

    $scope.getAllSelected = function() {
        angular.forEach($scope.objectForValueOfCheckbox, function (key, value) {
            var intValue = parseInt(value);
            if (key){
                $scope.coursesIdsOfStudent.push(intValue);
            }
        });
    };

    $scope.insertCoursesToStudent = function(){
        for(var i=0; i<$scope.courses.length; i++){
            for(var j= 0; j < $scope.coursesIdsOfStudent.length; j++){
                if($scope.courses[i].id == $scope.coursesIdsOfStudent[j]) {
                    $scope.student.courses.push(new $scope.newCourse($scope.courses[i]));
                }
            }
        }
    };

    $scope.insertStudentToCourses = function(){
        var arrayIdsForInsert = $scope.coursesIdsOfStudent;
        for(var i=0;i<arrayIdsForInsert.length;i++){
            $scope.courses.forEach( function (arrayItem)
            {
                if(arrayItem.id == arrayIdsForInsert[i]){
                    arrayItem.students.push($scope.student);
                }
            });
        }
    };

     $scope.insertCoursesOfStudent = function(){
         if(funcAndVarService.arrayIsNull($scope.coursesIdsOfStudent)){return}
         var student = $scope.student;
         student.coursesIds = $scope.coursesIdsOfStudent;
         homeService.addStudentCourses(student).then(function(res){
             $scope.insertCoursesToStudent();
             $scope.insertStudentToCourses();
         },function(err){
             console.log("error add student courses request" + err.data);
         })
     };

     $scope.saveFieldsChanges = function() {
         $scope.getAllSelected();
         homeService.addStudent($scope.student).then(function (res) {
             if(res.data=="one or more of the fields is missing"){
                 return
             }
             $scope.student.id = res.data.rows.insertId;
             $scope.insertCoursesOfStudent();
             $scope.student.indexInStudents = $scope.students.length;
             $scope.students.push($scope.student);
             $state.go('School', {students1: $scope.students, courses1: $scope.courses});
             $state.go('School.studentView',
                 {
                 student1: $scope.student,
                 students: $scope.students,
                 courses: $scope.courses
                 });
         }, function (err) {
             console.log("error add student request" + err.data);
         })
     };

     $scope.addStudent = function(){
         if ($scope.form.file.$valid && $scope.file) {
             homeService.uploadStudentImage($scope.file,function(res){
                     $scope.student.image = res.data.path;
                     $scope.saveFieldsChanges();
                 }
             )}
         else{
             $scope.imageNotSelected = true;
         }
     };

    return init();

}]);

