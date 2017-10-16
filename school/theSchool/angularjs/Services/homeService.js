
angular .module("myApplication").service("homeService",["$http","Upload",function($http,Upload) {

    this.login = function (user) {
        return $http({
            method: "POST",
            url: "http://localhost:3200/login",
            data: user
        })
    };

    this.logout = function () {
        return $http({
            method: "POST",
            url: "http://localhost:3200/logout"
        })
    };

///////////////////////////////school functions:
    this.getCourses = function () {
        return $http({
            method: "GET",
            url: "http://localhost:3200/sales/getCourses"
        })
    };

    this.getStudents = function () {
        return $http({
            method: "GET",
            url: "http://localhost:3200/sales/getStudents"
        })
    };

    this.updateStudent = function (student) {
        return $http({
            method: "POST",
            url: "http://localhost:3200/sales/updateStudent",
            data: student
        })
    };

    this.updateCourse = function (course) {
        return $http({
            method: "POST",
            url: "http://localhost:3200/manager/updateCourse",
            data: course
        })
    };

    this.addStudent = function (student) {
        return $http({
            method: "POST",
            url: "http://localhost:3200/sales/addStudent",
            data: student
        })
    };

    this.addStudentCourses = function (student) {
        return $http({
            method: "POST",
            url: "http://localhost:3200/sales/addStudentCourses",
            data: student
        })
    };

    this.deleteStudent = function (student) {
        return $http({
            method: "POST",
            url: "http://localhost:3200/sales/deleteStudent",
            data: student
        })
    };

    this.deleteCourse = function (course) {
        return $http({
            method: "POST",
            url: "http://localhost:3200/sales/deleteCourse",
            data: course
        })
    };

    this.uploadStudentImage = function(file,func){
        Upload.upload({
            url: "http://localhost:3200/sales/uploadFileStudent",
            data: {file: file}
        }).then(function(res){
            func(res);
        }, function (err) {
            console.log('Error status: ' + err.status);
        }, function (evt) {
        });
    };

    this.uploadCourseImage = function(file,func){
        Upload.upload({
            url: "http://localhost:3200/sales/uploadFileCourse",
            data: {file: file}
        }).then(function(res){
            func(res);
        }, function (err) {
            console.log('Error status: ' + err.status);
        }, function (evt) {
        });
    };

    this.addCourse = function(file,course,func){
        Upload.upload({
            url: "http://localhost:3200/sales/addCourse",
            data: {file: file,course:course}
        }).then(function(res){
            func(res);
        }, function (err) {
            console.log('Error status: ' + err.status);
        }, function (evt) {
        });
    };
    ////////////////////administration functions:
    this.getAdmins = function () {
        return $http({
            method: "GET",
            url: "http://localhost:3200/manager/getAdmins"
        })
    };

    this.getAllAdmins = function () {
        return $http({
            method: "GET",
            url: "http://localhost:3200/owner/getAdmins"
        })
    };

    this.deleteAdmin = function (admin) {
        return $http({
            method: 'POST',
            url: "http://localhost:3200/owner/deleteAdmin",
            data: admin
        })
    };

    this.updateOwner = function (admin) {
        return $http({
            method: 'POST',
            url: "http://localhost:3200/owner/updateAdmin",
            data: admin
        })
    };

    this.updateManager = function (admin) {
        return $http({
            method: 'POST',
            url: "http://localhost:3200/manager/updateAdmin",
            data: admin
        })
    };

    this.uploadAdminImage = function(file,func){
        Upload.upload({
            url: "http://localhost:3200/manager/uploadFileAdmin",
            data: {file: file}
        }).then(function(res){
            func(res);
        }, function (err) {
            console.log('Error status: ' + err.status);
        }, function (evt) {
        });
    };

    this.addAdmin = function(file,admin,func){
        Upload.upload({
            url: "http://localhost:3200/owner/addAdmin",
            data: {file: file,admin:admin}
        }).then(function(res){
            func(res);
        }, function (err) {
            console.log('Error status: ' + err.status);
        }, function (evt) {
        });
    }
}]);
