'use strict';
angular.module('store')
.controller('ReturnOrderCtrl', function ($log, $rootScope, $stateParams, $state, $scope, Store, Config) {

  $log.log('Hello from your Controller: ReturnOrderCtrl in module store:. This is your controller:', this);

  /* Storing contextual this in a variable for easy access */

  var ctrl = this;
  ctrl.orders = [];
  ctrl.start = 0;
  ctrl.page = 0;
  ctrl.noMoreItemsAvailable = false;

  /*----------  Storing Order object  ----------*/

  ctrl.order = JSON.parse($stateParams.order);
console.log("order obj.......",ctrl.order);

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
      ctrl.successMsg = "";
    });
  };

  ctrl.msgShow = "";
  ctrl.successMsg = "";
  ctrl.requestReturnOrder = function() {
      console.log("called....");
      var file = $("#returnReqUpload")[0].files[0];
      console.log('file', file,ctrl.returnIssue);
      console.log('orderObj...........', Config.ENV.USER.AUTH_TOKEN);
      if(angular.isUndefined(ctrl.returnIssue) || ctrl.returnIssue == ""|| angular.isUndefined(file)) {
        ctrl.msgShow = "*Please select image and enter order issue.";
        ctrl.successMsg = "";
      } else {    
          ctrl.msgShow = "";
          var data = new FormData();
          data.append('file', file);
          data.append('orderId',ctrl.order.orderId);
          data.append('returnText', ctrl.returnIssue);
          data.append('authToken', Config.ENV.USER.AUTH_TOKEN);
          $('#loaderImg').show();
          $('#body').fadeTo(0, 0.4);
          $('#body').css("overflow", "hidden");
          $('#body').css("pointer-events", "none");
          var success = function(data){
            ctrl.returnIssue = "";
            ctrl.successMsg = "Your request has been received. We will process it within 7 working days.";
            $rootScope.$emit( 'setUserDetailForMenu' );
             var notification = {};
                notification.type = 'success';
                notification.text = 'Order returned successfully';
                $rootScope.$emit( 'setNotification', notification );
                $('#loaderImg').hide();
                $('#body').fadeTo(0, 1);
                $('#body').css("overflow", "scroll");
                $('#body').css("pointer-events", "all");
          }
          var error = function(err){
            alert('error')
            ctrl.successMsg = "";
            $('#loaderImg').hide();
            $('#body').fadeTo(0, 1);
            $('#body').css("overflow", "scroll");
            $('#body').css("pointer-events", "all");
          }
          Store.uploadReturnImage(data, success, error)
    }
  }

});
