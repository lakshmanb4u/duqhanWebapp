'use strict';
angular
  .module('store')
  .controller('AfterPaymentCtrl', function (
    $log,
    $localStorage,
    $state,
    $rootScope,
    Store,
    BusyLoader
  ) {
    $log.log(
      'Hello from your Controller: AfterPaymentCtrl in module store:. This is your controller:',
      this
    );

    /* Storing contextual this in a variable for easy access */
    var ctrl = this;

    ctrl.checkPaymentStatus = function () {
      BusyLoader.show();
      $log.log('checkPaymentStatus');
      $log.log($localStorage.duqhanPayKey);
      Store.checkPaymentStatus($localStorage.duqhanPayKey)
        .then(function (response) {
          $log.log(response);
          $rootScope.$emit('getCartTotalNumber');
          var notification = {};
          if (response.data.status === 'approved') {
            $state.go('store.orderhistory');
            notification.type = 'success';
            notification.text = 'Item purchased successfully.';
            $rootScope.$emit('setNotification', notification);
          } else if (response.data.status === 'retry') {
            $state.go('store.cart');
            notification.type = 'failure';
            notification.text = 'Something went wrong. Please try again.';
          } else {
            $state.go('store.cart');
            notification.type = 'failure';
            notification.text =
              'We did not recieved the payment . Please try again.';
          }
          $rootScope.$emit('setNotification', notification);
          delete $localStorage.duqhanPayKey;
          BusyLoader.hide();
        })
        .catch(function (error) {
          $log.log(error);
          BusyLoader.hide();
        });
    };

    ctrl.checkPaymentStatus();
  });
