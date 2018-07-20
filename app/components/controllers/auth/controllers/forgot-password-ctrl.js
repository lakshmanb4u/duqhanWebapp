'use strict';
angular.module('auth')
.controller('ForgotPasswordCtrl', function (
	$log,
	$location,
	$ionicAuth,
  $state,
  Store,
  $stateParams,
  Auth
  ) {

  var ctrl = this;

  $log.log('Hello from your Controller: ForgotPasswordCtrl in module auth:. This is your controller:', ctrl);

  ctrl.user = {
    email: '',
    resetCode: '',
    newPassword: ''
  };
  ctrl.user.email = $stateParams.email;
  ctrl.requestPasswordReset = function () {
    ctrl.responseCB = '';
    console.log('called.............');
    if (ctrl.requestPasswordResetForm.$valid) {
      var user = {};
      user.email = ctrl.user.email;
      var s = new Date().getTime();
      Auth.requestPasswordReset(user)
      .then(function (response) {
        var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Request password reset','JS Web request-password-reset',t);
        $log.log(response);
        ctrl.responseCB = response.data.status;
        $state.go('change-password', { email: response.data.email });
        // $location.path('/change-password');
      })
      .catch(function (response) {
        $log.log(response);
        ctrl.responseCB = response.data.status;
      });
    }
  };
  ctrl.confirmPasswordReset = function () {
    ctrl.responseCB = '';
    if (ctrl.confirmPasswordResetForm.$valid) {
      ctrl.user.email = $stateParams.email;
      ctrl.user.newPassword = ctrl.user.newPassword;
      ctrl.user.resetCode = ctrl.user.resetCode;
      var s = new Date().getTime();
      Auth.confirmPasswordReset(ctrl.user)
      .then(function (response) {
        var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Confirm password reset','JS Web confirm-password_reset',t);
        $log.log(response);
        ctrl.responseCB = response.data.status;
        $state.go('landing');
      })
      .catch(function (response) {
        $log.log(response);
        ctrl.responseCB = response.data.status;
      });
    }
  };
});
