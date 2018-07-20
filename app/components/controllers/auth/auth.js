'use strict';
angular
  .module('auth', ['ionic', 'ngCordova', 'ui.router', 	'ui.bootstrap',  'ngMessages'])
  .config(function ($locationProvider, $stateProvider) {
    // ROUTING with ui.router
    // $locationProvider.html5Mode(true);
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html
	.state('landing', {
        url: "/landing",
        templateUrl: 'components/views/landing.html',
        controller: 'UserCtrl as ctrl' 
    })
    .state('login', {
        url: "/login",
        templateUrl: 'components/views/login.html',
        controller: 'LoginCtrl as ctrl' 
    })
    .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'components/views/forgot-password.html',
        controller: 'ForgotPasswordCtrl as ctrl'
    })
    .state('change-password', {
        url: '/change-password/:email',
        params: {
            email: null
       },
        templateUrl: 'components/views/change-password.html',
        controller: 'ForgotPasswordCtrl as ctrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'components/views/register.html',
        controller: 'SignupCtrl as ctrl'
    })
    ;

    // .state('aboutus', {
    //     url: '/aboutus',
    //     templateUrl: 'auth/templates/misc/about.html'
	// })
	// .state('contactus', {
    //     url: '/contactus',
    //     templateUrl: 'auth/templates/misc/contactus.html',
    //     controller: 'ContactusPublicCtrl as ctrl'
	// })
	// .state('returnPolicy', {
    //     url: '/return-policy',
    //     templateUrl: 'auth/templates/misc/return-policy.html'
	// })
	// .state('privacyPolicy', {
    //     url: '/privacy-policy',
    //     templateUrl: 'auth/templates/misc/privacy-policy.html'
	// })
	// .state('termsConditions', {
    //     url: '/terms-conditions',
    //     templateUrl: 'auth/templates/misc/terms-conditions.html'
	// });
  })
  // .config(function ($cordovaFacebookProvider) {
  //   var appID = 698576100317336;
  //   var version = 'v2.8'; // or leave blank and default is v2.0
  //   //$cordovaFacebookProvider.browserInit(appID, version);
  // })
  .config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    //Inject the interceptor
    $httpProvider.interceptors.push('HttpInterceptor');
  });
