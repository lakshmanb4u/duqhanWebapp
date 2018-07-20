'use strict';
angular.module('main', [
  'ionic',
  'ionic.cloud',
  'ngCordova',
  'ui.router',
  'ngStorage',
  'angulartics',
  'angulartics.facebook.pixel',
  'ui.bootstrap',
  'socialLogin',
  'jkAngularRatingStars',
  'auth',
  'store'
])
  .config(function ($stateProvider, $urlRouterProvider) {

    // $httpProvider.interceptors.push('HttpInterceptor');
    // ROUTING with ui.router
    $urlRouterProvider.otherwise('');
  })
  // ADD: initialize $ionicCloudProvider with app_id
  .config(function ($ionicCloudProvider) {
    $ionicCloudProvider.init({
      'core': {
        'app_id': 'ad64e5e2'
      },
      'auth': {
        'facebook': {
          'scope': ['email', 'public_profile']
        }
      }
    });
  })
  .config(function(socialProvider){
    socialProvider.setFbKey({appId: "698576100317336", apiVersion: "v2.8"});
  })
  /* .config(function(socialProvider){
    socialProvider.setFbKey({appId: "737053439824097", apiVersion: "v2.11"});
  }) */
  /*.config(function(socialProvider){
    socialProvider.setFbKey({appId: "167867597051671", apiVersion: "v2.11"});
  })*/

  .run(function ($ionicPlatform, $log, $rootScope, $state,$localStorage,$http) {
    /*var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           $localStorage.countryCode = xhttp.countryCode;
        }
    };
    xhttp.open("GET", "http://ip-api.com/json", true);
    xhttp.send();*/
    $http.get('https://api.ipdata.co')
      .success(function(data) {
        $localStorage.countryCode = data.country_code;
      })
      .error(function(data){
        $localStorage.countryCode = "IN";
      });  

    if (angular.isUndefined($localStorage.savedUser)) {
      var obj ={
        email :'guest@gmail.com',
        password :'dukhan123',
        name :'Guest User',
        authtoken :'dukhan123'
      }
      $localStorage.savedUser =  JSON.stringify(obj);
    }
    $rootScope.$state = $state;
     $ionicPlatform.ready(function () {
       $log.log('Device details==================');
       $log.log(ionic.Platform.platform());
       $log.log(ionic.Platform.device());
       $log.log(ionic.Platform.version());
       $log.log(ionic.Platform.ua);
       if (window.cordova) {
         // eslint-disable-next-line no-undef
         FCMPlugin.onNotification(function (data) {
           $log.log(data);
           if (data.wasTapped) {
             $log.log('Notification was received on device tray and tapped by the user.');
             $log.log(JSON.stringify(data));
           } else {
             $log.log('Notification was received in foreground. Maybe the user needs to be notified.');
             $log.log(JSON.stringify(data));
          }
           if (data.payment && data.payment === 'Done') {
             $rootScope.$emit('closeCordovaInAppBrowser');
           }
         });
         window.cordova.plugins.firebase.crash.report('BOOM! Testing crash report');
       }
     });
  });
