
angular.module("myApplication").controller("AdministrationCtrl",["$scope","homeService","funcAndVarService","$state","$stateParams",
    function($scope,homeService,funcAndVarService,$state,$stateParams){


        function init(){

        }
        funcAndVarService.ifReloadPage();
        $scope.roleIsOwner = false;
        $scope.newAdmins = $stateParams.admins1;
        if($scope.newAdmins==null) {
            $scope.getAdmins = function () {
                homeService.getAdmins().then(function (res) {
                    $scope.admins = res.data;
                    $scope.role = "manager";
                    $scope.numberOfAdmins = $scope.admins.length;
                    $state.go("Administration.numberOfAdmins", {numberOfAdmins: $scope.numberOfAdmins});

                }, function (err) {
                    console.log(err)
                })
            };

            $scope.getAllAdmins = function () {
                homeService.getAllAdmins().then(function (res) {
                    if (res.data !== "user unauthorized") {
                        $scope.admins = res.data;
                        $scope.role = "owner";
                        $scope.roleIsOwner = true;
                        $scope.numberOfAdmins = $scope.admins.length;
                        $state.go('Administration.numberOfAdmins', {numberOfAdmins: $scope.numberOfAdmins});
                    }
                    else {
                        $scope.getAdmins();
                    }
                }, function (err) {
                    console.log(err)
                })
            };

            $scope.getAllAdmins();
        }
        else{
            $scope.admins = $scope.newAdmins;
            $scope.role = $stateParams.role1;
            $state.go('Administration.numberOfAdmins', {numberOfAdmins: $scope.numberOfAdmins});
        }

        $scope.editAdmin = function (admin, $index) {
            admin.indexInAdmins = $index;
            $state.go('Administration.editAdmins', {admins: $scope.admins, admin: admin, role: $scope.role});
        };

        $scope.addAdmin = function () {
            $state.go('Administration.addAdmin', {admins: $scope.admins,role: $scope.role});
        };


        return init();


    }]);







