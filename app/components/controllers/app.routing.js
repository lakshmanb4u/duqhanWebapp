// AboutController.js
// For distribution, all controllers
// are concatanated into single app.js file
// by using Gulp

'use strict';

var app = angular.module('duqhan', [  
    'ionic',
    'ngCordova',
    'ngStorage',
    'angulartics',
    'angulartics.facebook.pixel',
    'ui.router']
)

// Routing configuration for this module
app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/store/products");

    $stateProvider
        .state('store', {
            url: "/store",
            abstract: true,
            // Other states should insert their content here
            templateUrl: 'components/views/store.html',
            controller: 'StoreController' 
        })
        .state('store.state1', {
            url: "/state1",
            templateUrl: 'components/views/latest.html',
            onEnter: function() { console.log('entering state1'); }
        })
        .state('content.state2', {
            url: "/state2",
            template: '<h1>Hello from state2!</h1>',
            onEnter: function() { console.log('entering state2'); }
        })

        .state('landing', {
            url: "/landing",
            templateUrl: 'components/views/landing.html',
            controller: 'LandingController' 
        })
        .state('login', {
            url: "/login",
            templateUrl: 'components/views/login.html',
            controller: 'LoginController' 
        })
    }
);

// app.config(function ($ionicCloudProvider) {
//     $ionicCloudProvider.init({
//         'core': {
//             'app_id': 'ad64e5e2'
//         },
//         'auth': {
//             'facebook': {
//                 'scope': ['email', 'public_profile']
//             }
//         }
//     });
// })
    
