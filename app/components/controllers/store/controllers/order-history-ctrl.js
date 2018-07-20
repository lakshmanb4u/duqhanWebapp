'use strict';
angular.module('store')
.controller('OrderHistoryCtrl', function ($log, $rootScope,$localStorage,$stateParams, $state, $scope, Store, Config) {

  $log.log('Hello from your Controller: OrderHistoryCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;
  ctrl.orders = [];
  ctrl.start = 0;
  ctrl.page = 0;
  ctrl.noMoreItemsAvailable = false;
  ctrl.busyInLoading = false;
  ctrl.showNoOrders = "";
  ctrl.noOrder = false;
  /*=========================================
  =            Get order history            =
  =========================================*/
  if (angular.isUndefined($localStorage.savedUser)) {
        $state.go('landing', {next_url: $localStorage.url});
  }
  if ($localStorage.savedUser) {
        var savedUser = JSON.parse($localStorage.savedUser);
        if (savedUser.email === 'guest@gmail.com') {
          $localStorage.$reset();
          $state.go('landing');
        }
    }
  ctrl.getOrderHistory = function () {
    ctrl.busyInLoading = true;
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
      console.log("response.....",response);
      ctrl.busyInLoading = false;
      ctrl.orders = ctrl.orders.concat(response.data.orderDetailsDtos);
      ctrl.page++;
      if (response.data.orderDetailsDtos > 0) {
        ctrl.noMoreItemsAvailable = false;
      } 

      if(ctrl.orders == null || ctrl.orders.length == 0){
        ctrl.showNoOrders = "No orders found...";
        ctrl.noOrder = true
        ctrl.busyInLoading = true;
			} else {
        ctrl.showNoOrders = "";
        ctrl.noOrder = false;
        if(response.data.orderDetailsDtos == null || response.data.orderDetailsDtos.length == 0) {
          ctrl.busyInLoading = true;
        } else {
          ctrl.busyInLoading = false;
        }
			}
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

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
      var notification = {};
      notification.type = 'success';
      notification.text = 'Your request has been recieved. We will process it within 7 working days.';
      $rootScope.$emit('setNotification', notification);
    })
    .catch(function (error) {
      $log.log(error);
    });
  };

  /*----------  call the function at the time of initialization  ----------*/


  /*----------  Load more products  ----------*/
  ctrl.loadMore = function () {
    if (ctrl.busyInLoading) return;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if ($state.current.name === 'store.orderhistory') {
        ctrl.getOrderHistory();
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

  /*----------  Storing Order object  ----------*/

  ctrl.order = $stateParams.order;

  ctrl.goToOrderDetails = function(order) {
    $state.go('store.orderdetails',{order: JSON.stringify(order)});
  }
});
