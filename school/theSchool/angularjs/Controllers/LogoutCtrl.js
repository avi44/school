
angular.module("myApplication").controller("LogoutCtrl",["$scope","homeService","funcAndVarService","$state","$rootScope",
                                                    function($scope,homeService,funcAndVarService,$state,$rootScope){


    function init(){

    }
    funcAndVarService.ifReloadPage();

        $scope.logout = function() {
            homeService.logout().then(function (res) {
                if (localStorage.getItem("sesion") != null) {
                    localStorage.removeItem("sesion");
                    localStorage.removeItem("userObject");
                    $rootScope.isLogin = false;
                    $rootScope.isAdmin = false;
                    $state.go('login');
                }
            }, function (err) {
                console.log(err)
            })
        };
         $scope.logout();
    return init();


}])