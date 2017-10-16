angular.module("myApplication").controller("addAdminCtrl",["$scope","homeService","funcAndVarService","$state","$stateParams",
                                                        function($scope,homeService,funcAndVarService,$state,$stateParams){


    function init(){
    }
     $scope.admins = $stateParams.admins;
     $scope.role = $stateParams.role;
     $scope.admin = {};
     $scope.admin.name = '';
     $scope.admin.phone = '';
     $scope.admin.email = '';
     $scope.admin.role = '';
     $scope.admin.userName = '';
     $scope.admin.password = '';
     $scope.imageNotSelected = false;

     $scope.imageSelected  = function(){
         $scope.imageNotSelected = false;
     };

     $scope.addAdmin = function(){
         if($scope.role == "owner"){
            if($scope.form.file.$valid && $scope.file) {
                 homeService.addAdmin($scope.file,$scope.admin,function(res){
                     if(res.data=="one or more of the fields is missing"){
                         return
                     }
                    $scope.admin.image = res.data.path;
                    $scope.admin.id = res.data.rows.insertId;
                    $scope.admins.push($scope.admin);
                    $scope.numberOfAdmins = $scope.admins.length;
                    $state.go('Administration',{admins1:$scope.admins,role1:$scope.role});
                    $state.go('Administration.numberOfAdmins', {numberOfAdmins: $scope.numberOfAdmins});
                 })
            }
            else{
                $scope.imageNotSelected = true;
            }
         }
     };

    return init();


}]);

