'use strict';
angular.module('main').controller('LandingController', function($scope,
    $location,
    $state,
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
    Firebase
) {
    var ctrl = this;    
    console.log("Hi in login controller");
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
    
    ctrl.loggingUser = {};
        
    ctrl.internalFacebookLogin = function () {
        var img = null;
        var fbUser = {};
    
        Auth.facebookLogin()
        .then(function (facebook) {
            fbUser.email = facebook.email;
            fbUser.name = facebook.displayName;
            fbUser.fbid = facebook.providerId;
            fbUser.latitude = Config.ENV.USER.LATITUDE;
            fbUser.longitude = Config.ENV.USER.LONGITUDE;
            fbUser.userAgent = ionic.Platform.ua;
            img = facebook.photoURL;
            return Firebase.includeFCMToken(fbUser);
        })
        .then(function (fbUser) {
            return Auth.fbLogin(fbUser);
        })
        .then(function (response) {
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
            if (ctrl.savedUser.freeProductEligibility) {
              // $state.go('store.freeProducts');
              $state.go('store.state1');
            } else {
              $state.go('store..state1');
            }
            /* eslint-disable camelcase */
            window.Intercom('boot', {
              app_id: 'zcqrnybo',
              email: ctrl.savedUser.email,
              user_id: ctrl.savedUser.userId
            });
            /* eslint-enable camelcase */
            window.Intercom('update');
        })
        .catch(function (error) {
            $localStorage.$reset();
            $state.go('landing');
        });
    };
    
});
