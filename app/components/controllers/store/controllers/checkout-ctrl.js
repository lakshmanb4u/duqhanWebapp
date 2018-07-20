'use strict';
angular
  .module('store')
  .controller('CheckoutCtrl', function (
    $rootScope,
    $scope,
    $log,
    $ionicModal,
    $stateParams,
    $state,
    $localStorage,
    $window,
    $ionicPopup,
    Store
  ) {
    $log.log(
      'Hello from your Controller: CheckoutCtrl in module store:. This is your controller:',
      this
    );

    /* Storing contextual this in a variable for easy access */

    var ctrl = this;

    ctrl.init = function() {
      $window.scrollTo(0, 0);
    }
    
    /*----------  Storing cart object  ----------*/
    ctrl.loadCartItems = function () {
      var s = new Date().getTime();
      Store.getCart()
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Cart','JS Web cart',t);
          $log.log(response.data);
          ctrl.cart = response.data;
          ctrl.cart.orderTotal = 0;
          ctrl.cart.shippingTotal = 0;
          angular.forEach(ctrl.cart.products, function (p) {
            ctrl.cart.orderTotal = ctrl.cart.orderTotal + p.discountedPrice * p.qty;
          });
          angular.forEach(ctrl.cart.products, function (p) {
            ctrl.cart.shippingTotal = ctrl.cart.shippingTotal + p.shippingRate;
          });
          ctrl.cart.orderTotalWithShipping =
            ctrl.cart.orderTotal + ctrl.cart.shippingTotal;

          console.log('cart items :',ctrl.cart);
          if(ctrl.cart.products == null) {
            $state.go('store.emptycart');
          }
          if(ctrl.cart.products.length == 0) {
            ctrl.noMoreOrdersAvailable = true;
          } else {
            ctrl.noMoreOrdersAvailable = false;
          }
        //  onVisaCheckoutReady(ctrl.cart);
          angular.forEach(ctrl.cart.products, function (p) {
            if (!p.available) {
              var notification = {};
              notification.type = 'failure';
              notification.text = 'Some of your products are out of stack.';
              $rootScope.$emit('setNotification', notification);
              return;
            }
          });
            !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
              n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1612756512132293');
            fbq('track', 'InitiateCheckout', {
                    value: ctrl.cart.orderTotal,
                    currency: 'INR',
                    content_type: "product",
            });
        })
        .catch(function (response) {
          $log.log(response);
        });
    };

    /*----------  call the function at the time of initialization  ----------*/

    ctrl.loadCartItems();
    /*console.log('state params : ',JSON.parse($stateParams.cart));
    ctrl.cart = JSON.parse($stateParams.cart);*/

    /*===========================================
    =            Get default address and email            =
    ===========================================*/

    ctrl.getDefaultAddress = function () {
      var s = new Date().getTime();
      Store.getDefaultAddress()
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Get default addresses','JS Web get-default-addresses',t);
          $log.log('getDefaultAddress');
          $log.log(response.data.addresses);
          if (response.data.addresses.length > 0) {
            ctrl.address = response.data.addresses[0];
            ctrl.isDeliveryAddress = "";
            /* calling the shipping detail function to get the shipping cost with this delivery address */
            ctrl.cart.deliveryAddressId = response.data.addresses[0].addressId;
            ctrl.getShippingDetails(ctrl.cart);
          } else {
            ctrl.address = null;
          }
          return Store.getUserEmailAndPhone();
        })
        .then(function (response) {
          $log.log('getUserEmailAndPhone');
          $log.log(response.data);
          ctrl.userEmail = response.data.email;
          ctrl.mobile = response.data.mobile;
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    /*=====  End of Get default address and email  ======*/

    /*======================================================
    =            Get the shipping cost and time            =
    ======================================================*/

    ctrl.getShippingDetails = function (cart) {
      $log.log(cart);
      var s = new Date().getTime();
      Store.getShippingDetails(cart)
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Get shipment','JS Web get-shipment',t);
          $log.log('getShippingDetails');
          $log.log(response.data);
          var tempCart = response.data;
          var orderTotal = ctrl.cart.orderTotal;
          var shippingTotal = 0;
          angular.forEach(tempCart.products, function (p, i) {
            orderTotal = orderTotal + p.shippingRate;
            shippingTotal = shippingTotal + p.shippingRate;
            ctrl.cart.products[i].shippingRate = p.shippingRate;
            ctrl.cart.products[i].shippingTime = p.shippingTime;
          });
          ctrl.cart.orderTotalWithShipping = orderTotal;
          ctrl.cart.shippingTotal = shippingTotal;
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    /*=====  End of Get the shipping cost and time  ======*/

    /*----------  call the function at the time of initialization  ----------*/

    ctrl.getDefaultAddress();

    /*----------  call the function when user is in cart page  ----------*/

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      console.log("checkout state change called...............",toState);
      $log.log(event);
      if (toState.name === 'store.checkout') {
        ctrl.getDefaultAddress();
      }
    });

    /*===============================================
    =            Change delivery address            =
    ===============================================*/

    ctrl.addressSelectionError = true;

    ctrl.changeAddress = function () {
      var s = new Date().getTime();
      Store.getAddresses()
        .then(function (response) {
          ctrl.addresses = response.data.addresses;
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Get addresses','JS Web get-addresses',t);
          //ctrl.modal.show();
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    ctrl.selectAddress = function () {
      console.log("select address called..........",ctrl.selectedAddress);
      $log.log(ctrl.selectedAddress);
      if (ctrl.selectedAddress) {
        ctrl.address = ctrl.selectedAddress;
        /* calling the shipping detail function to get the shipping cost with this delivery address */
        ctrl.cart.deliveryAddressId = ctrl.address.addressId;
        ctrl.getShippingDetails(ctrl.cart);
        //ctrl.closeModal();
        ctrl.isDeliveryAddress = "";
        $('#myModal').modal('toggle');
      } else {
        ctrl.addressSelectionError = false;
      }
    };

    ctrl.setSelectedAddess= function(address) {
      ctrl.selectedAddress = address;
    };
    ctrl.addAddress = function () {
      $('#myModal').modal('toggle');
      $('#addNewAddressModal').modal('show');
    };

    ctrl.addressDTO = {
      isResidential: false,
      status: true,
  };

  ctrl.saveAddress = function () {
      $log.log(ctrl.addressDTO);
      if(ctrl.addressDTO.isResidential == null || angular.isUndefined(ctrl.addressDTO.isResidential)) {
          ctrl.addressDTO.isResidential = false;
      }
      ctrl.addressDTO.status = ctrl.addressDTO.status ? 1 : 2;
      var s = new Date().getTime();
      Store.saveAddress(ctrl.addressDTO)
      .then(function (response) {
        $('#addNewAddressModal').modal('toggle');
        $('#myModal').modal('show');
        var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Save address','JS Web save-address',t);
        ctrl.changeAddress();
        ctrl.getDefaultAddress();
      })
      .catch(function (error) {
          $log.log(error);
      });
  };

    ctrl.setTempAddressForCheckout = function (address) {
      ctrl.address = address;
      /* calling the shipping detail function to get the shipping cost with this delivery address */
      ctrl.cart.deliveryAddressId = ctrl.address.addressId;
      ctrl.getShippingDetails(ctrl.cart);
    };

    // Catching calls from outside this controller
    $rootScope.$on('setTempAddressForCheckout', function (event, address) {
      $log.log(event);
      $log.log('on setTempAddressForCheckout');
      ctrl.setTempAddressForCheckout(address);
    });

    /*=====  End of Change delivery address  ======*/

    /*=======================================
    =            Set Email Address            =
    =======================================*/
    ctrl.data = {};
    ctrl.contactDetailsError = "";
    ctrl.setUserEmailAndPhone = function () {
      console.log("email...........",ctrl.data.email);
      console.log("phone.......",ctrl.data.mobile);
      
                $log.log(ctrl.data);
                Store.setUserEmailAndPhone(ctrl.data)
                  .then(function (response) {
                    $log.log('setUserEmail');
                    $("#contactDetailsModal").modal('toggle');
                    if (response && response.data && response.data.email && response.data.mobile) {
                      ctrl.userEmail = response.data.email;
                      ctrl.mobile = response.data.mobile;
                      ctrl.contactDetailsError = "";
                      ctrl.pay();
                    } else {
                      var notification = {};
                      notification.type = 'failure';
                      notification.text = 'Something went wrong! Please try again.';
                      $rootScope.$emit('setNotification', notification);
                      ctrl.contactDetailsError = "Something went wrong! Please try again.";
                    }
                  })
                  .catch(function (error) {
                    $log.log(error);
                  });
              
    };

    /*=====  End of Set Email Address  ======*/

    /*=======================================
    =            Payment section            =
    =======================================*/

    ctrl.selectPaymentGateway = function () {
      ctrl.cart.paymentGateway = 2;
      //ctrl.paymentGatewayModal.show();
    };

    ctrl.isDeliveryAddress = "";
    ctrl.isPayPalBrowserOpen = false;
    ctrl.pay = function () {
      $log.log(ctrl.cart);
      $log.log(ctrl.address);
      //ctrl.closePaymentGatewayModal();
      $('#myModalPay').modal('toggle');
      if (!ctrl.address) {
        /*var notification = {};
        notification.type = 'failure';
        notification.text = 'Please select a delivery address';
        $rootScope.$emit('setNotification', notification);*/
        ctrl.isDeliveryAddress = "*Please select a delivery address";
        return;
      }
      ctrl.isDeliveryAddress = "";
      ctrl.data.email = ctrl.userEmail;
      ctrl.data.mobile = ctrl.mobile;
      if (!ctrl.userEmail || !ctrl.mobile) {
        $log.log('email not found');
        $("#contactDetailsModal").modal('show');
        return;
      }
      ctrl.cart.deliveryAddressId = ctrl.address.addressId;
      ctrl.cart.addressDto = ctrl.address;

      //Only for web
      ctrl.cart.appType = 2;
      var s = new Date().getTime();
      Store.checkout(ctrl.cart)
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Checkout','JS Web checkout',t);
          $log.log('response ==');
          $log.log(response.data.status);
          ctrl.payKey = response.data.statusCode;
          var paymentUrl = response.data.paymentUrl;
          $localStorage.duqhanPayKey = ctrl.payKey;
          if (ctrl.cart.paymentGateway === 2) {
            var options = response.data.parameters;
            var url = paymentUrl;
            for (var key in options) {
              if (options.hasOwnProperty(key)) {
                $log.log(key + ' -> ' + options[key]);
                if (url === paymentUrl) {
                  key === 'CHECKSUMHASH' ?
                    (url +=
                      '?' +
                      key +
                      '=' +
                      window.encodeURIComponent(options[key])) :
                    (url += '?' + key + '=' + options[key]);
                } else {
                  key === 'CHECKSUMHASH' ?
                    (url +=
                      '&' +
                      key +
                      '=' +
                      window.encodeURIComponent(options[key])) :
                    (url += '&' + key + '=' + options[key]);
                }
              }
            }
            paymentUrl = url + '&APPTYPE=' + ctrl.cart.paymentGateway;
          }
            var contents = [];
            angular.forEach(ctrl.cart.products, function (p) {
                contents.push({
                      id: p.productId,
                      quantity: p.qty,
                      item_price: p.discountedPrice
                })
              });
           !function (f, b, e, v, n, t, s) {
            if (f.fbq) return; n = f.fbq = function () {
              n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
            n.queue = []; t = b.createElement(e); t.async = !0;
            t.src = v; s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1612756512132293');
            fbq('track', 'Purchase', {
              value: ctrl.cart.orderTotal,
              currency: 'INR',
              content_type: 'product',
              contents : contents
            });

          $window.location.href = paymentUrl;
        })
        .catch(function (error) {
          $log.log(error);
        });
    };

    /*function onVisaCheckoutReady(cart){
      V.init( {
      apikey: "VXLK9F2R8HA5LPB3KAYT21dvzXrtIL922xCSuKMSkgOZFAczk",
      paymentRequest:{
        currencyCode: cart.symbol,
        subtotal: cart.orderTotalWithShipping
      }
      });
    V.on("payment.success", function(payment)
      {console.log("success-----",payment); });
    V.on("payment.cancel", function(payment)
      {console.log("cancel-----",payment); });
    V.on("payment.error", function(payment, error)
      {console.log("error payment-----",payment);console.log("error -----",error); });
    };
*/
   
    /*=====  End of Payment section  ======*/

    /*===============================================
    =            Modal related functions            =
    ===============================================*/

    /*$ionicModal
      .fromTemplateUrl('select-address-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function (modal) {
        ctrl.modal = modal;
      });

    ctrl.closeModal = function () {
      ctrl.modal.hide();
    };

    $ionicModal
      .fromTemplateUrl('store/templates/select-payment-gateway.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function (modal) {
        ctrl.paymentGatewayModal = modal;
      });

    ctrl.closePaymentGatewayModal = function () {
      ctrl.paymentGatewayModal.hide();
    };*/

    // Cleanup the modal when we're done with it!
    //$scope.$on('$destroy', function () {
      //ctrl.modal.remove();
    //});

    /*=====  End of Modal related functions  ======*/
  });
