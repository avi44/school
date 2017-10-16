/**
 * Created by Jbt on 3/1/2017.
 */
angular.module("myApplication",[
    "ui.router",'ngFileUpload'

]).config(["$httpProvider","$stateProvider","$urlRouterProvider",function($httpProvider,$stateProvider,$urlRouterProvider){

    var interceptor = function ($q){
        return {
            'request' : function(request){
                if(localStorage.getItem("sesion")!= null){
                    var userKey = localStorage.getItem("sesion");
                request.headers.authorization =  userKey;
                }
                //do something
                //check if login is in request
                //if is not add key to header
                   return request;     
            },
            'requestError' : function(err){
                   //do somthing
                   return $q.reject(err);
            },
            'response' : function(response){
                   //do somthing
                   return response;     
            }
        }
    };
    $httpProvider.interceptors.push(interceptor);
    $urlRouterProvider.otherwise('/login');
    $stateProvider.state(
        'login',{
            url:'/login',
            controller:'LoginCtrl',
            templateUrl:'Views/Login.html'
        })
        .state(
            'Administration',{
                url:'/Administration',
                controller:'AdministrationCtrl',
                params: {
                    admins1: null,
                    role1: null
                },
                templateUrl:'Views/Administration.html'
            })
        .state(
            'School',{
                url:'/school',
                controller:'SchoolCtrl',
                params: {
                    students1: null,
                    courses1: null
                },
                templateUrl:'Views/School.html'
            })
        .state(
            'Logout',{
                url:'/logout',
                controller:'LogoutCtrl',
                templateUrl:'Views/Logout.html'
        })
        .state(
            'School.studentView',{
                url:'/studentView',
                controller:'studentViewCtrl',
                params: {
                    student1: null,
                    courses: null,
                    students: null
                },
                templateUrl:'Views/SchoolInternalViews/studentView.html'
            })
        .state(
            'School.courseView',{
                url:'/courseView',
                controller:'courseViewCtrl',
                params: {
                    course: null,
                    courses: null,
                    students: null
                },
                templateUrl:'Views/SchoolInternalViews/courseView.html'
            })
        .state(
            'School.numberOfStudentsView',{
                url:'/numberOfStudentsView',
                controller:'numberOfStudentsViewCtrl',
                params: {
                    students: null,
                    courses: null
                },
                templateUrl:'Views/SchoolInternalViews/numberOfStudentsView.html'
            })
        .state(
            'School.addCourse',{
                url:'/addCourse',
                controller:'addCourseCtrl',
                params: {
                    students: null,
                    courses: null
                },
                templateUrl:'Views/SchoolInternalViews/addCourse.html'
            })
        .state(
            'School.addStudent',{
                url:'/addStudent',
                params: {
                    students: null,
                    courses: null
                },
                controller:'addStudentCtrl',
                templateUrl:'Views/SchoolInternalViews/addStudent.html'
            })
        .state(
            'School.editStudent',{
                url:'/editStudent',
                params: {
                    student: null,
                    courses: null,
                    students: null
                },
                controller:'editStudentCtrl',
                templateUrl:'Views/SchoolInternalViews/editStudent.html'
            })
        .state(
            'School.editCourse',{
                url:'/editCourse',
                params: {
                    course: null,
                    courses: null,
                    students: null
                },
                controller:'editCourseCtrl',
                templateUrl:'Views/SchoolInternalViews/editCourse.html'
            })
        .state(
            'Administration.numberOfAdmins',{
                url:'/numberOfAdmins',
                params: {
                    numberOfAdmins: null
                },
                controller:'numberOfAdminsCtrl',
                templateUrl:'Views/AdministrationInternalViews/numberOfAdmins.html'
            })
        .state(
            'Administration.editAdmins',{
                url:'/editAdmins',
                params: {
                    admin: null,
                    admins: null,
                    role: null
                },
                controller:'editAdminsCtrl',
                templateUrl:'Views/AdministrationInternalViews/editAdmins.html'
            })
        .state(
            'Administration.addAdmin',{
                url:'/addAdmin',
                params: {
                    admins: null,
                    role: null
                },
                controller:'addAdminCtrl',
                templateUrl:'Views/AdministrationInternalViews/addAdmin.html'
            })
}]);