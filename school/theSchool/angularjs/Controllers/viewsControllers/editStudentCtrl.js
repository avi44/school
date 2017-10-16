angular.module("myApplication").controller("editStudentCtrl",["$scope","homeService","funcAndVarService","$state","$stateParams",
    function($scope,homeService,funcAndVarService,$state,$stateParams){


        function init(){
        }
        $scope.student = funcAndVarService.assignThisObject($stateParams.student);
        $scope.students = $stateParams.students;
        $scope.courses = $stateParams.courses;
        $scope.newIdCoursesOfStudent = [];
        $scope.objectForValueOfCheckbox = {};
        $scope.isSaveStudentChangesClicked = false;
        $scope.isDeleteTheStudentClicked = false;
        $scope.deleteWarning = false;
        $scope.numberOfStudents = '';
        $scope.objName = "student";
        if(funcAndVarService.arrayIsNotNull($scope.student.courses)){
            for(var i=0; i<$scope.courses.length; i++) {
                for(var j= 0; j < $scope.student.courses.length; j++) {
                    if($scope.courses[i].id == $scope.student.courses[j].id) {
                        $scope.courses[i].check = true;
                        $scope.objectForValueOfCheckbox[$scope.courses[i].id] = true;
                    }
                }
            }
        }

        $scope.warningOfDelete = function(){
            $scope.deleteWarning = true;
        };

        $scope.pushIdsToIdsOfCourses = function() {
            if(funcAndVarService.arrayIsNull($scope.student.courses)){return}
            for(var i= 0; i < $scope.student.courses.length; i++) {
                $scope.student.idsOfCourses.push($scope.student.courses[i].id)
            }
        };

        $scope.deleteStudentFromCourses = function(arrayIdsForDelete){
            if(funcAndVarService.arrayIsNull(arrayIdsForDelete)){return}
            for(var i=0;i<arrayIdsForDelete.length;i++){
                for(var j=0;j<$scope.courses.length;j++){
                    if($scope.courses[j].check!=undefined){delete($scope.courses[j].check)}
                    if($scope.courses[j].id == arrayIdsForDelete[i]){
                        $scope.courses[j].students = $scope.courses[j].students.filter(function(obj) {
                            return obj.id !== $scope.student.id;
                        });
                    }
                }
            }
        };

        $scope.deleteTheStudent = function(){
            $scope.isDeleteTheStudentClicked = true;
            $scope.student.idsOfCourses = [];
            $scope.pushIdsToIdsOfCourses();
            $scope.deleteStudentFromCourses($scope.student.idsOfCourses);
            homeService.deleteStudent($scope.student).then(function(res){
                $scope.students.splice($scope.student.indexInStudents,1);
                $scope.numberOfStudents = $scope.students.length;
                $state.go('School',{courses1:$scope.courses,students1:$scope.students});
                $state.go('School.numberOfStudentsView',{students:$scope.numberOfStudents,courses:$scope.numberOfCourses});
            },function(err){
                console.log("delete course err:" + err.data)
            });
        };

        $scope.dontDeleteTheStudent = function(){
            if($scope.isDeleteTheCourseClicked == true){return}
            $scope.deleteWarning = false;
        };

        $scope.getAllSelected = function() {
            angular.forEach($scope.objectForValueOfCheckbox, function (key, value) {
                var intValue = parseInt(value);
                if (key){
                    $scope.newIdCoursesOfStudent.push(intValue);
                }
            });
        };

        $scope.insertStudentToCourses = function(arrayIdsForInsert){
            if(funcAndVarService.arrayIsNull(arrayIdsForInsert)){return}
            for(var i=0;i<arrayIdsForInsert.length;i++){
                $scope.courses.forEach( function (arrayItem)
                {
                    if(arrayItem.id == arrayIdsForInsert[i]){
                        arrayItem.students.push($scope.student);

                    }
                });
            }
        };

        $scope.saveFieldsChanges = function() {
            $scope.isSaveStudentChangesClicked = true;
            $scope.getAllSelected();
            $scope.student.newIdCoursesOfStudent = $scope.newIdCoursesOfStudent;
            homeService.updateStudent($scope.student).then(function(res){
                if(res.data=="one or more of the fields is missing"){
                    $scope.newIdCoursesOfStudent = [];
                    return
                }
                var idsArrayDeleteStudentsFromCourses = res.data.coursesDelete;
                var idsArrayInsertStudentsToCourses = res.data.coursesInsert;
                $scope.deleteStudentFromCourses(idsArrayDeleteStudentsFromCourses);
                $scope.insertStudentToCourses(idsArrayInsertStudentsToCourses);
                $scope.newCoursesOfStudent = [];
                for(var i=0; i<$scope.courses.length; i++) {
                    for(var j= 0; j < $scope.newIdCoursesOfStudent.length; j++) {
                        if($scope.courses[i].id== $scope.newIdCoursesOfStudent[j]) {
                            $scope.newCoursesOfStudent.push($scope.courses[i])
                        }
                    }
                }
                delete($scope.student.newIdCoursesOfStudent);
                $scope.student.courses = $scope.newCoursesOfStudent;
                $scope.students.splice($scope.student.indexInStudents,1,$scope.student);
                $state.go('School',{students1:$scope.students,courses1:$scope.courses});
                $state.go('School.studentView',{student1: $scope.student, courses: $scope.courses, students: $scope.students});
            },function(err){
                console.log("error update student request" + err.data);
            });
        };

        $scope.saveStudentChanges = function(){
            if ($scope.form.file.$valid && $scope.file) {
                homeService.uploadStudentImage($scope.file,function(res){
                        $scope.student.image = res.data.path;
                        $scope.saveFieldsChanges();
                    }
                )}
            else{
                $scope.saveFieldsChanges();
            }
        };

        return init();

    }]);

