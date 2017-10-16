
angular.module("myApplication").controller("LoginCtrl",["$scope","homeService","funcAndVarService","$state","$rootScope",
                                                    function($scope,homeService,funcAndVarService,$state,$rootScope){


    function init(){

    }
        $rootScope.isLogoute = true;
        $scope.loginForm = {};
        $scope.loginForm.userName = "";
        $scope.loginForm.password = "";
        $scope.incorrectUserNameOrPassword = false;

        $scope.login = function(){
            homeService.login($scope.loginForm).then(function(res){
                if(res.data.message!="user unauthorized" && res.data.role=="sales"){
                    $rootScope.isLogoute = false;
                    $rootScope.isLogin = true;
                    $rootScope.name = res.data.name;
                    $rootScope.role = res.data.role;
                    $rootScope.image = res.data.image;
                    localStorage.setItem("userObject",JSON.stringify(res.data));
                    localStorage.setItem("sesion",res.data.key);
                    var data = JSON.parse(localStorage.getItem("userObject"));
                    $state.go('School');
                }
                else if(res.data.message!="user unauthorized" && (res.data.role=="owner" || res.data.role=="manager") ){
                    $rootScope.isLogoute = false;
                    $rootScope.isLogin = true;
                    $rootScope.isAdmin = true;
                    $rootScope.name = res.data.name;
                    $rootScope.role = res.data.role;
                    $rootScope.image = res.data.image;
                    localStorage.setItem("userObject",JSON.stringify(res.data));
                    localStorage.setItem("sesion",res.data.key);
                    $state.go('School');
                }
                else{
                    jQuery(".incorrectInLogin").css({"color":"rgb(7,65,118)"});
                    $scope.incorrectUserNameOrPassword = true;
                }
            },function(err){
                console.log(err);
            })
        };

        $scope.submit = function() {
            if ($scope.form.file.$valid && $scope.file) {
                homeService.uploadImage($scope.file,function(res){
                    console.log(res.data.path);
                    }
                )}
        };










        /*$scope.submit = function() {
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
                console.log($scope.file)
            }
        };*/
            //$scope.path = "";

/*        $scope.upload = function(file){
            homeService.uploadImage(file);
        };*/



            /*$scope.upload = function (file) {
            Upload.upload({
                url: "http://localhost:3200/uploadFile",
                data: {file: file}
            }).then(function (res) {
                //console.log('Success ' + res.config.data.file.name + 'uploaded. Response: ' + res.data);
                //$scope.path = res.data.path;
            }, function (err) {
                console.log('Error status: ' + err.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };*/
    return init();


}]);