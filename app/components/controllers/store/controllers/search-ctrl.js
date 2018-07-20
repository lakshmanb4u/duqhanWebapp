'use strict';
angular.module('store')
  .controller('SearchCtrl', function ($log, $stateParams, $scope, $rootScope, $state, Store, Config) {

    $log.log('Hello from your Controller: SearchCtrl in module store:. This is your controller:', this);

    /* Storing contextual this in a variable for easy access */
    var ctrl = this;
    ctrl.products = [];
    ctrl.start = 0;
    ctrl.page = 0;
    ctrl.busyInLoading = false;
    ctrl.noMoreItemsAvailable = false;
    ctrl.searchProduct = function (searchText) {
      console.log('search text.................',searchText);
      ctrl.busyInLoading = true;
      ctrl.showStatus = false;
      /*----------  Storing url parameter (product id) in scope ----------*/
      ctrl.searchText = searchText;
      var productsParam = {
        start: ctrl.start + (ctrl.page * Config.ENV.PRODUCTS_PER_PAGE),
        limit: Config.ENV.PRODUCTS_PER_PAGE,
        name: ctrl.searchText
      };
      var s = new Date().getTime();
      Store.searchProduct(productsParam)
        .then(function (result) {
          /* Randoize items */
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Search product','JS Web search-product',t);
          console.log(result);
            result.data.products.sort(function () {
              return .5 - Math.random();
            });

          ctrl.products = ctrl.products.concat(result.data.products);
          ctrl.page++;
          
          console.log('length ........................',result.data.products.length,ctrl.products.length);
          ctrl.showStatus = true;
          ctrl.busyInLoading = false;
          if(ctrl.products == null || ctrl.products.length == 0) {
            console.log('condition.............',(ctrl.products.length == 0 || ctrl.showStatus));
            $state.go('store.searchNotFound', { searchText: $stateParams.searchText });
          } else {
            if(result.data.products == null || result.data.products.length == 0) {
              ctrl.busyInLoading = true;
            } else {
              ctrl.busyInLoading = false;
            }
          }
          var productsIds = [];
      for (var i = 0; i < 5 && i < ctrl.products.length; i++) {
        productsIds.push(ctrl.products[i].productId);
      }
      console.log('productsIds--->', productsIds);
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
    fbq('track', 'Search', {
            search_string: ctrl.searchText,
            content_ids: productsIds,
          });
        })
        .catch(function (response) {
          $log.log(response);
        });
    };

    ctrl.toggleSearchBar = function () {
      $rootScope.searcBarActive = !$rootScope.searcBarActive;
    };

    /*----------  Load more products  ----------*/
    ctrl.loadMore = function () {
      console.log("load more............",ctrl.start,ctrl.page);
      if (ctrl.busyInLoading) return;
        //ctrl.noMoreItemsAvailable = true;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if ($state.current.name === 'store.productsSearch') {
          ctrl.searchProduct($stateParams.searchText);
        }
      
    };

    /*----------  call the function when user is in search result page  ----------*/
    //ctrl.searchProduct($stateParams.searchText);
    /*$rootScope.$on('$stateChangeSuccess', function (event, toState) {
      console.log('on state change success called.................');
      ctrl.products = [];
      ctrl.start = 0;
      ctrl.page = 0;
      ctrl.noMoreItemsAvailable = false;
      if (toState.name === 'store.productsSearch') {
        ctrl.searchProduct($stateParams.searchText);
      }
    });*/

    ctrl.goToProductDetailsPage = function (evt, productId) {
      if (evt.which === 1) {
        $state.go('store.overview', { productId: productId });
      }
      };

    /*=====  End of call the function when user is in search result page  ======*/

    ctrl.sortBy =  function(sortMethod) {
      console.log('filter called..........'+sortMethod);
      var productsParam = {};
      if(sortMethod == 'recent'){
        ctrl.popular = false;
        ctrl.latest = false;
        productsParam = {
          start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
          limit: Config.ENV.PRODUCTS_PER_PAGE,
          isRecent: true,
          name: ctrl.searchText
        };
      } else if (sortMethod == 'latest') {
        ctrl.popular = false;
        ctrl.recent = false;
        productsParam = {
          start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
          limit: Config.ENV.PRODUCTS_PER_PAGE,
          isRecent: false,
          name: $stateParams.searchText
        };
      }
      Store.searchProduct(productsParam);
    }
  });
