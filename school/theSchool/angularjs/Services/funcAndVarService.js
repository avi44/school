
angular .module("myApplication").service("funcAndVarService",["$rootScope",function($rootScope) {

    this.arrayIsNotNull = function(array){
        if(array.length !=0){
            return true
        }
        return false
    };

    this.arrayIsNull = function(array){
        if(array.length ==0){
            return true
        }
        return false
    };

    this.assignThisObject = function(value){
        var newValue = Object.assign({},value)
        return newValue
    };

    this.ifReloadPage = function(){
        var user = JSON.parse(localStorage.getItem("userObject"));
        $rootScope.name = user.name;
        $rootScope.role = user.role;
        $rootScope.image = user.image;
        if(user.role!=undefined && user.role=="sales"){
            $rootScope.isLogin = true;
        }
        else if(user.role!=undefined && (user.role=="owner" || user.role=="manager")){
            $rootScope.isLogin = true;
            $rootScope.isAdmin = true;
        }
    };

    this.assignThisArray = function(value){
        var newValue = Object.assign([],value)
        return newValue
    };

}]);
