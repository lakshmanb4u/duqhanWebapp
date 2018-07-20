'use strict';
angular.module('main').controller('UserCtrl', function (
  $location,
  $state,
  $stateParams,
  $localStorage,
  $rootScope,
  $ionicAuth,
  $ionicFacebookAuth,
  $ionicUser,
  // $cordovaGeolocation,
  $timeout,
  $analytics,
  Config,
  Auth,
  Store,
  Firebase,
  BusyLoader,
  $http
) {
  var ctrl = this;
  /*ctrl.next_url = $stateParams.next_url;
  console.log('ctrl.next_url in landing', ctrl.next_url);*/
  console.log('Control :', ctrl);
  console.log("saved user....",$localStorage.savedUser);
  if ($localStorage.savedUser != null){
    $state.go('store');
  }
  document.getElementById("body").classList.remove('authenticate');
  document.getElementById("body").classList.add('landing');

 
  ctrl.user = {
    email: '',
    password: ''
  };
  ctrl.savedUser = {
    email: '',
    password: '',
    name: '',
    authtoken: '',
    socialLogin: false,
    userId: ''
  };

  ctrl.user1 = {
    email: '',
    password: '',
    name: '',
    mobile:''
  };

  ctrl.loggingUser = {};
  $rootScope.isInternalLogin = false;
  $rootScope.isInternalFacebookLogin = false;

  ctrl.guestLogin = function () {
      var user = {};
      Auth.guestLogin(user).then(function (response) {
        ctrl.savedUser.email = response.data.email;
        ctrl.savedUser.password = user.password;
        ctrl.savedUser.name = response.data.name;
        ctrl.savedUser.authtoken = response.data.authtoken;
        ctrl.savedUser.profileImage = response.data.profileImg;
        ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
        Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
        Config.ENV.USER.NAME = response.data.name;
        Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
        $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
        $rootScope.$emit('setUserDetailForMenu');
        if (angular.isDefined($localStorage.url)){
            var url = angular.copy($localStorage.url);      
            $location.path(url);
          } else {
            $state.go('store');
          }
      })
      .catch(function (response) {
        $localStorage.$reset();
        if (response.data && response.data.statusCode === '403') {
          ctrl.responseCB = 'Invalid credential.';
        } else {
          ctrl.responseCB = 'Something went wrong. Please try again.';
        }
        //$state.go('landing');
        $rootScope.isInternalLogin = false;
        //destroyFunction();
        $rootScope.$emit('onLoginFail', ctrl.responseCB);
      });
    };


  ctrl.internalLogin = function (user) {
    console.log('In login');
    $rootScope.isInternalLogin = true;
    user.latitude = Config.ENV.USER.LATITUDE;
    user.longitude = Config.ENV.USER.LONGITUDE;
    user.countryCode = ctrl.countryCode;
    user.userAgent = ionic.Platform.ua;
    var s = new Date().getTime();
    Firebase.includeFCMToken(user)
      .then(function (user) {
        return Auth.login(user);
      })
      .then(function (response) {
        var e = new Date().getTime();
        var t = e-s;
        Store.awsCloudWatch('JS Web Login','JS Web login',t);
        ctrl.savedUser.email = user.email;
        ctrl.savedUser.password = user.password;
        ctrl.savedUser.name = response.data.name;
        ctrl.savedUser.authtoken = response.data.authtoken;
        ctrl.savedUser.profileImage = response.data.profileImg;
        ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
        Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
        Config.ENV.USER.NAME = response.data.name;
        Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
        $rootScope.$emit('setUserDetailForMenu');
        $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
          if (angular.isDefined($localStorage.url)){
            var url = angular.copy($localStorage.url);      
            $location.path(url);
          } else {
            $state.go('store');
          }
      })
      .catch(function (response) {
        $localStorage.$reset();
        if (response.data && response.data.statusCode === '403') {
          ctrl.responseCB = 'Invalid credential.';
        } else {
          ctrl.responseCB = 'Something went wrong. Please try again.';
        }
        //$state.go('landing');
        $rootScope.isInternalLogin = false;
        //destroyFunction();
        $rootScope.$emit('onLoginFail', ctrl.responseCB);
      });
  };

  ctrl.internalFacebookLogin = function () {
    var img = null;
    var fbUser = {};
    $rootScope.isInternalFacebookLogin = true;
    var s = new Date().getTime();
    var deregisterKey = $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
      console.log('UserDetails : ', userDetails);
      console.log('Event : ', event);
      fbUser.email = userDetails.email;
      fbUser.name = userDetails.name;
      fbUser.fbid = userDetails.uid;
      fbUser.latitude = Config.ENV.USER.LATITUDE;
      fbUser.longitude = Config.ENV.USER.LONGITUDE;
      fbUser.countryCode = ctrl.countryCode;
      fbUser.userAgent = ionic.Platform.ua;
      img = userDetails.imageUrl;
      Firebase.includeFCMToken(fbUser).then(function (){
        Auth.fbLogin(fbUser).then(function(response){
          var e = new Date().getTime();
        var t = e-s;
        Store.awsCloudWatch('JS Web Fb login','JS Web fb-login',t);
          console.log('Response of Fblogin :', response); 
          ctrl.savedUser.email = fbUser.email;
          ctrl.savedUser.name = fbUser.name;
          ctrl.savedUser.userId = fbUser.fbid;
          ctrl.savedUser.authtoken = response.data.authtoken;
          ctrl.savedUser.profileImage = response.data.profileImg ? response.data.profileImg : img;
          ctrl.savedUser.freeProductEligibility = response.data.freeProductEligibility;
          ctrl.savedUser.socialLogin = true;
          Config.ENV.USER.AUTH_TOKEN = response.data.authtoken;
          Config.ENV.USER.NAME = response.data.name;
          Config.ENV.USER.PROFILE_IMG = ctrl.savedUser.profileImage;
          $rootScope.$emit('setUserDetailForMenu');
          $localStorage.savedUser = JSON.stringify(ctrl.savedUser);
          if (response.data.isFirstLogin) {
            $analytics.eventTrack('CompleteRegistration');
          }
          if (angular.isDefined($localStorage.url)){
            var url = angular.copy($localStorage.url);      
            $location.path(url);
          } else {
            $state.go('store');
          }
          /* eslint-disable camelcase */
          window.Intercom('boot', {
            app_id: 'zcqrnybo',
            email: ctrl.savedUser.email,
            user_id: ctrl.savedUser.userId
          });
          /* eslint-enable camelcase */
          window.Intercom('update');
          deregisterKey();
        }).catch(function (error) {
            $localStorage.$reset();
            $rootScope.isInternalFacebookLogin = false;
            deregisterKey();
            $state.go('landing');
        });
  
      });
    });
  };

  ctrl.autoLogin = function () {
    var savedUser = $localStorage.savedUser;
    if (!savedUser) {
     return;
    }

    var parsedUser = JSON.parse(savedUser);

    if (parsedUser.socialLogin) {
      // var fbUser = {};
      // var img = null;
      Auth.isLoggedIn()
        .then(function () {
          if (parsedUser.freeProductEligibility) {
            // $state.go('store.freeProducts');
            $state.go('store');
          } else {
            $state.go('store');
          }
        })
        .catch(function (error) {
          ctrl.internalFacebookLogin();
        });
    } else {
      var user = {};
      user.email = parsedUser.email;
      user.password = parsedUser.password;
      ctrl.internalLogin(user);
    }
  };

  //Call autologin
 // ctrl.autoLogin();
  window.Intercom('boot', {
    // eslint-disable-next-line camelcase
    app_id: 'zcqrnybo'
  });

  // Catching calls from outside this controller
  var destroyFunction = $rootScope.$on('internalLogin', function (event, user) {
    console.log("internal login called...........",$rootScope.isInternalLogin);
    if($rootScope.isInternalLogin == false) {
      ctrl.internalLogin(user);
    }
  });
  $rootScope.$on('internalFacebookLogin', function (event) {
    console.log("internal fb login............",$rootScope.isInternalFacebookLogin);
    if($rootScope.isInternalFacebookLogin == false) {
      ctrl.internalFacebookLogin();
    }
  });

  $rootScope.$on('onLoginFail', function (event, response) { 
      ctrl.responseCB = response;
    });

  ctrl.notification = {};

  ctrl.facebookLogin = function () {
    ctrl.internalFacebookLogin();
  };
  ctrl.login = function () {
    console.log('IN LOGIN1');
    ctrl.responseCB = '';
    if (ctrl.loginForm.$valid) {
      ctrl.internalLogin(ctrl.user);
    } else {
      ctrl.responseCB = 'Invalid credential.';
    }
    };

    ctrl.signup = function () {
    ctrl.responseCB = '';
    if (ctrl.signupForm.$valid) {
      BusyLoader.show();
      ctrl.user1.password = ctrl.user1.password;
      var posOptions = {timeout: 1000, enableHighAccuracy: false};
        ctrl.user1.latitude = Config.ENV.USER.LATITUDE;
        ctrl.user1.longitude = Config.ENV.USER.LONGITUDE;
        ctrl.user1.userAgent = ionic.Platform.ua;
        var s = new Date().getTime();
        Auth.signup(ctrl.user1).then(function (response) {
        var e = new Date().getTime();
        var t = e-s;
        Store.awsCloudWatch('JS Web Signup','JS Web signup',t);  
        ctrl.internalLogin(ctrl.user1);
      })
      .catch(function (response) {
        BusyLoader.hide();
        if (response.data.statusCode === '403') {
          ctrl.responseCB = response.data.status;
        } else {
          ctrl.responseCB = 'Something went wrong. Please try again.';
        }
      });
    }
  };

  ctrl.setNotification = function (notification) {
    ctrl.notification.type = notification.type;
    ctrl.notification.text = notification.text;
    $timeout(function () {
      ctrl.notification = {};
    }, 5000);
  };

  $rootScope.$on('setUnauthorizedNotification', function (event, notification) {
    ctrl.setNotification(notification);
  });
  navigator.geolocation.getCurrentPosition(function(location) {
    Config.ENV.USER.LATITUDE = location.coords.latitude;
    Config.ENV.USER.LONGITUDE = location.coords.longitude;
  });
  $http.get('https://api.ipdata.co')
  .success(function(data) {
      console.log(data.country_code)
      ctrl.countryCode = data.country_code;
  })
  .error(function(data){
      ctrl.countryCode = "IN";
  });
});
