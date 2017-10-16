
angular.module("myApplication").controller("editAdminsCtrl",["$scope","homeService","$rootScope","$state","$stateParams","funcAndVarService",
                                                      function($scope,homeService,$rootScope,$state,$stateParams,funcAndVarService){


    function init(){
    }

        $scope.admins = $stateParams.admins;
        $scope.admin = funcAndVarService.assignThisObject($stateParams.admin) ;
        $scope.role = $stateParams.role;
        $scope.isDeleteTheAdminClicked = false;
        $scope.deleteWarning = false;
        $scope.roleIsOwner = $scope.role == "owner";
        $scope.objName = "admin";

        $scope.warningOfDelete = function(){
            $scope.deleteWarning = true;
        };

        $scope.dontDeleteTheAdmin = function(){
            $scope.deleteWarning = false;
        };

        $scope.deleteTheAdmin = function(){
            $scope.isDeleteTheAdminClicked = true;
            homeService.deleteAdmin($scope.admin).then(function(res){
            },function(err){
                console.log("error in delete admin:" , err)
            });
            $scope.admins.splice($scope.admin.indexInAdmins,1);
            $scope.numberOfAdmins = $scope.admins.length;
            $state.go('Administration',{admins:$scope.admins,role:$scope.role});
            $state.go('Administration.numberOfAdmins', {numberOfAdmins: $scope.numberOfAdmins});
        };

        $scope.updateAdminChanges = function(){
            $scope.admins.splice($scope.admin.indexInAdmins,1,$scope.admin);
            $scope.numberOfAdmins = $scope.admins.length;
            $state.go('Administration',{admins1:$scope.admins,role1:$scope.role});
            $state.go('Administration.numberOfAdmins', {numberOfAdmins: $scope.numberOfAdmins});
        };

        $scope.saveFieldsChanges = function() {
            if($scope.roleIsOwner) {
                homeService.updateOwner($scope.admin).then(function (res) {
                    if(res.data=="one or more of the fields is missing"){
                        return
                    }
                    $scope.updateAdminChanges();
                }, function (err) {
                    console.log("error in delete admin:", err)
                });
            }
            else{
                homeService.updateManager($scope.admin).then(function (res) {
                    if(res.data=="one or more of the fields is missing"){
                        return
                    }
                    $scope.updateAdminChanges();
                }, function (err) {
                    console.log("error in delete admin:", err)
                });
            }
        };

        $scope.saveAdminChanges = function(){
            if ($scope.form.file.$valid && $scope.file) {
                homeService.uploadAdminImage($scope.file,function(res){
                    $scope.admin.image = res.data.path;
                    $scope.saveFieldsChanges();
                    }
                )}
            else{
                $scope.saveFieldsChanges();
            }
        };

    return init();
}]);



