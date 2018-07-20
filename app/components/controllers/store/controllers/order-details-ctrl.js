'use strict';
angular.module('store')
.controller('OrderDetailsCtrl', function ($log, $rootScope, $stateParams, $state, $scope, Store, Config) {

  $log.log('Hello from your Controller: OrderDetailsCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;
  ctrl.orders = [];
  ctrl.start = 0;
  ctrl.page = 0;
  ctrl.noMoreItemsAvailable = false;

  /*----------  Storing Order object  ----------*/

  ctrl.order = JSON.parse($stateParams.order);
console.log("order obj.......",ctrl.order);
  /*=========================================
  =            Get order history            =
  =========================================*/

  ctrl.getOrderHistory = function () {
    var param = {
      start: ctrl.start + (ctrl.page * Config.ENV.PRODUCTS_PER_PAGE),
      limit: Config.ENV.PRODUCTS_PER_PAGE,
    };
    var s = new Date().getTime();
    Store.getOrderHistory(param)
    .then(function (response) {
      var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Get order details','JS Web get-order-details',t);
      ctrl.orders = ctrl.orders.concat(response.data.orderDetailsDtos);
      ctrl.page++;
      if (response.data.orderDetailsDtos > 0) {
        ctrl.noMoreItemsAvailable = false;
      }
    })
    .catch(function (error) {
      $log.log(error);
    });
  };
ctrl.cancelOrdMsg = "";
  ctrl.cancelOrder = function (orderId) {
    var order = {'orderId': orderId};
    $log.log('hi');
    var s = new Date().getTime();
    Store.cancelOrd(order)
    .then(function (response) {
      var e = new Date().getTime();
      var t = e-s;
      Store.awsCloudWatch('JS Web Cancel order','JS Web cancel-order',t);
      $log.log(response);
      ctrl.cancelOrdMsg = "Your order has been cancelled.";
      var notification = {};
      notification.type = 'success';
      notification.text = 'Your request has been recieved. We will process it within 7 working days.';
      $rootScope.$emit('setNotification', notification);
    })
    .catch(function (error) {
      $log.log(error);
      ctrl.cancelOrdMsg = "";
    });
  };

  /*----------  call the function at the time of initialization  ----------*/

  ctrl.getOrderHistory();

  /*----------  Load more products  ----------*/
  ctrl.loadMore = function () {
    if (!ctrl.noMoreItemsAvailable) {
      ctrl.noMoreItemsAvailable = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if ($state.current.name === 'store.orderhistory') {
        ctrl.getOrderHistory();
      }
    }
  };

  /*----------  call the function when user is in cart page  ----------*/

  /*$rootScope.$on('$stateChangeSuccess', function (event, toState) {
    ctrl.orders = [];
    ctrl.start = 0;
    ctrl.page = 0;
    ctrl.noMoreItemsAvailable = false;
    if (toState.name === 'store.orderhistory') {
      ctrl.getOrderHistory();
    }
  });*/

  /*=====  End of Get order history  ======*/

  ctrl.gotoRetunOrder = function() {
    $state.go('store.returnOrder',{order:JSON.stringify(ctrl.order)});
  }
});
