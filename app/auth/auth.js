'use strict';
angular.module('auth', [
  'ionic',
  'ngCordova',
  'ui.router',
  'ngMessages'
])
.config(function ($locationProvider, $stateProvider) {

  // ROUTING with ui.router
  // $locationProvider.html5Mode(true);
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('landing', {
      url: '/landing',
      templateUrl: 'auth/templates/landing.html',
      controller: 'UserCtrl as ctrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'auth/templates/signup.html',
      controller: 'SignupCtrl as ctrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'auth/templates/login.html',
      controller: 'LoginCtrl as ctrl'
    })
    .state('forgot-password', {
      url: '/forgot-password',
      templateUrl: 'auth/templates/forgot-password.html',
      controller: 'ForgotPasswordCtrl as ctrl'
    })
    .state('change-password', {
      url: '/change-password/:email',
      templateUrl: 'auth/templates/change-password.html',
      controller: 'ForgotPasswordCtrl as ctrl'
    });
})
.config(function ($cordovaFacebookProvider) {
  var appID = 698576100317336;
  var version = 'v2.8'; // or leave blank and default is v2.0
  $cordovaFacebookProvider.browserInit(appID, version);
})
.config(function ($httpProvider) {
  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;

  //Remove the header used to identify ajax call  that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  //Inject the interceptor
  $httpProvider.interceptors.push('HttpInterceptor');
});
