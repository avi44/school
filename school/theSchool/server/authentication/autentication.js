var auth = {};

auth.userKeys = {};

auth.isAuth = function(session){
    if(auth.userKeys[session] == null){
        return false;
    }
    else if(auth.userKeys[session] == "sales" || auth.userKeys[session] == "manager" || auth.userKeys[session] == "owner" ){
        return true;
    }
};

auth.isAuthNotSales = function(session){
    if(auth.userKeys[session] == null){
     return false;
    }
    else if(auth.userKeys[session] == "manager" || auth.userKeys[session] == "owner" ){
        return true;
    }
};

auth.isAuthOwner = function(session){
    if(auth.userKeys[session] == null){
        return false;
    }
    else if(auth.userKeys[session] == "owner" ){
        return true;
    }
};

auth.addAuth = function(role){
    var key = guid();
    auth.userKeys[key] = role;
    return key;
};

auth.removeAuth = function(key){
    delete auth.userKeys[key];
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = auth;