'use strict';
angular.module('store')
  .controller('CartCtrl', function ($log, $rootScope,$localStorage, $cordovaInAppBrowser, $sce, Store, Common, $state, $window) {

    /* Storing contextual this in a variable for easy access */

    var ctrl = this;
    ctrl.noMoreOrdersAvailable = false;
    $log.log('Hello from your Controller: CartCtrl in module store:. This is your controller:', ctrl);

    /*============================================
    =            show cart page items            =
    ============================================*/

    /*----------  Initialize cart object  ----------*/

    ctrl.cart = {};

    /*----------  Get items in cart from backend  ----------*/

    ctrl.init = function() {
      $window.scrollTo(0, 0);
    }
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

    ctrl.loadCartItems = function () {
      var s = new Date().getTime();
      Store.getCart()
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Cart','JS Web cart',t);
          $log.log(response.data);
          ctrl.cart = response.data;
          console.log('cart items :',ctrl.cart);
          if(ctrl.cart.products == null) {
            $state.go('store.emptycart');
          }
          if(ctrl.cart.products.length == 0) {
            ctrl.noMoreOrdersAvailable = true;
          } else {
            ctrl.noMoreOrdersAvailable = false;
          }
          angular.forEach(ctrl.cart.products, function (p) {
            if (!p.available) {
              var notification = {};
              notification.type = 'failure';
              notification.text = 'Some of your products are out of stack.';
              $rootScope.$emit('setNotification', notification);
              return;
            }
          });
        })
        .catch(function (response) {
          $log.log(response);
        });
    };

    /*----------  call the function at the time of initialization  ----------*/

    ctrl.loadCartItems();

    /*----------  call the function when user is in cart page  ----------*/

    var destroyFun = $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      console.log("cart ctrl ... state change called.............",toState);
      $log.log(event);
      if (toState.name === 'store.cart') {
        ctrl.loadCartItems();
        destroyFun();
      }
    });

    /*=====  End of Get product list  ======*/

    /*----------  Helping function to create the dropdown of quantity in the cart page  ----------*/

    ctrl.getAvailability = function (num) {
      return new Array(num);
    };

    /*----------  Get shipping total  ----------*/

    ctrl.getShippingTotal = function () {
      var cartShippingTotal = 0;
      angular.forEach(ctrl.cart.products, function (item) {
        cartShippingTotal += item.shippingRate;
      });
      return cartShippingTotal;
    };

    /*----------  Get item total (calculate this manually so that we can change it when user change the quantity)  ----------*/

    ctrl.getCartItemTotal = function () {
      var cartItemTotal = 0;
      angular.forEach(ctrl.cart.products, function (item) {
        cartItemTotal += item.price * item.qty;
      });
      return cartItemTotal;
    };

    /*----------  Get order total (calculate this manually so that we can change it when user change the quantity)  ----------*/

    ctrl.getOrderTotal = function () {
      var cartorderTotal = 0;
      angular.forEach(ctrl.cart.products, function (item) {
        cartorderTotal += item.discountedPrice * item.qty;
      });
      return cartorderTotal + ctrl.getShippingTotal();
    };

    /*----------  Get discount total (calculate this manually so that we can change it when user change the quantity)  ----------*/

    ctrl.getDiscountTotal = function () {
      var cartItemTotal = 0,
        cartorderTotal = 0;
      angular.forEach(ctrl.cart.products, function (item) {
        cartItemTotal += item.price * item.qty;
        cartorderTotal += item.discountedPrice * item.qty;
      });
      return (cartItemTotal - cartorderTotal);
    };

    /*----------  Get discount percentage (calculate this manually so that we can change it when user change the quantity)  ----------*/

    ctrl.getDiscountPctTotal = function () {
      var cartItemTotal = 0,
        cartorderTotal = 0;
      angular.forEach(ctrl.cart.products, function (item) {
        cartItemTotal += item.price * item.qty;
        cartorderTotal += item.discountedPrice * item.qty;
      });
      return ((cartItemTotal - cartorderTotal) / cartItemTotal) * 100;
    };

    ctrl.decreaseQuantity = function(qty,productId) {
      //console.log('decrease called...........',qty,productId);
      var quantity = parseInt(qty);
      
      angular.forEach(ctrl.cart.products, function (item) {
        if(item.productId == productId) {
          if(quantity > 1 && quantity <= item.available) {
            quantity = quantity - 1;
          }
          item.qty = quantity;
        }
      });
      //console.log("..........",quantity);
    }

    ctrl.increaseQuantity = function(qty,productId) {
      //console.log('increase called...........',qty,productId);
      var quantity = parseInt(qty);
      
      angular.forEach(ctrl.cart.products, function (item) {
        if(item.productId == productId) {
          if(quantity >= 1 && quantity < item.available) {
            quantity = quantity + 1;
          }
          item.qty = quantity;
        }
      });
    }

    /*=====  End of show cart page items  ======*/

    /*========================================
    =            Remove from cart            =
    ========================================*/

    ctrl.getItemToBeDeleted = function (p) {
      ctrl.itemToDelete = p;
      console.log("item to delete..........",ctrl.itemToDelete);
    }
    ctrl.removeFromCart = function () {
      $log.log("remove from cart :",ctrl.itemToDelete);
      /*var title = 'Are you sure?',
        cancelText = 'No',
        okText = 'Yes';
      Common.getConfirmation(title, cancelText, okText)
        .then(function (response) {
          if (response) {*/
            var item = {};
            item.cartId = ctrl.itemToDelete.cartId;
            item.mapId = ctrl.itemToDelete.productPropertiesMapId;
            var s = new Date().getTime();
            Store.removeFromCart(item)
              .then(function (response) {
                var e = new Date().getTime();
                var t = e-s;
                Store.awsCloudWatch('JS Web Remove from Cart','JS Web remove-from-cart',t);
                $log.log(response.data);
                $("#myModal").modal('toggle');
                $rootScope.$emit('getCartTotalNumber');
                var notification = {};
                notification.type = 'success';
                notification.text = 'Item removed successfully';
                $rootScope.$emit('setNotification', notification);
                ctrl.loadCartItems();
              })
              .catch(function (response) {
                $log.log(response);
              });
         /* }
        })
        .catch(function (response) {
          $log.log(response);
        });*/

    };

    /*=====  End of Remove from cart  ======*/

    ctrl.testBrowser = function () {
      $log.log('hello');
      var options = {
        EnableViewPortScale: 'yes',
        transitionstyle: 'fliphorizontal',
        toolbarposition: 'top',
        closebuttoncaption: 'BACK',
        location: 'yes'
      };
      $cordovaInAppBrowser.open('http://www.google.com/', '_blank', options)
        .then(function (event) {
          $log.log(event);
        })
        .catch(function (event) {
          $log.log(event);
        });
    };

    ctrl.trustAsHtml = function (string) {
      return $sce.trustAsHtml(string);
    };

    ctrl.goToCheckoutPage = function () {
      //$state.go('store.checkout',{cart: JSON.stringify(ctrl.cart)});
      $state.go('store.checkout');
    }
  });
