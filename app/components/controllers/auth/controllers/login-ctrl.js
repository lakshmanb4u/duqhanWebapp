'use strict';
angular.module('auth')
  .controller('LoginCtrl', function (
    $rootScope,
    $localStorage,
    $state,
    $stateParams
  ) {

    var ctrl = this;
    ctrl.next_url = $stateParams.next_url
    console.log("saved user....",$localStorage.savedUser);
    if ($localStorage.savedUser != null){
      $state.go('store');
    }
    document.getElementById("body").classList.remove('landing');
    document.getElementById("body").classList.add('authenticate');

    ctrl.buttonView = false;
    ctrl.loginButtonText = 'Login with Email';


    ctrl.login = function () {
		console.log('IN LOGIN1');
		ctrl.responseCB = '';
		if (ctrl.loginForm.$valid) {
			$rootScope.$emit('internalLogin', ctrl.user);
		} else {
      ctrl.responseCB = 'Invalid credential.';
    }
		if (ctrl.buttonView) {
			ctrl.buttonView = false;
			ctrl.loginButtonText = 'Login';
		} else {
			
		}
    };

    ctrl.facebookLogin = function () {
      console.log("facebook login called...");
      $rootScope.$emit('internalFacebookLogin', ctrl.user);
    };

    $rootScope.$on('onLoginFail', function (event, response) { 
      ctrl.responseCB = response;
    });
  });
