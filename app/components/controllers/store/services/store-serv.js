'use strict';
angular.module('store')
  .factory('Store', function (
    $log,
    $http,
    $q,
    Config
  ) {

    $log.log('Hello from your Service: Store in module store');

    return {
      awsCloudWatch: function (name,apiName,time) {
        var param={
          name: name,
          apiName: apiName,
          timeTaken: time,
        };
         return $http.post(Config.ENV.SERVER_URL + 'user/aws-cloud-watch', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getProducts: function (param) {
        // return $http.get('dummy/products.json');
        return $http.post(Config.ENV.SERVER_URL + 'user/get-product', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getPriceFilter: function (param) {
        // return $http.get('dummy/products.json');
        return $http.post(Config.ENV.SERVER_URL + 'user/get-price-filter', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      searchProduct: function (param) {
        // return $http.get('dummy/products.json');
        return $http.post(Config.ENV.SERVER_URL + 'user/search-product', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getProductDetail: function (param) {
        // return $http.get('dummy/products.json');
        return $http.post(Config.ENV.SERVER_URL + 'user/get-product-detail', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      addToCart: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/add-to-cart', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getCart: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/cart', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getCartTotalNumber: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-cart-count', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      removeFromCart: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/remove-from-cart', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getProfileDetails: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-profile-details', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getCountryCode: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-country-code', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      updateProfileDetails: function (user) {
        return $http.post(Config.ENV.SERVER_URL + 'user/update-profile-details', user, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      updateProfileImage: function (image) {
        return $http.post(Config.ENV.SERVER_URL + 'user/update-profile-image', image, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getChildCategories: function (categoryId) {
        var category = {};
        category.categoryId = categoryId;
        return $http.post(Config.ENV.SERVER_URL + 'get-all-child-category', category, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getChildCategoriesById: function (categoryId) {
        var category = {};
        category.categoryId = categoryId;
        return $http.post(Config.ENV.SERVER_URL + 'get-child-category-byid', category, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      saveReview: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/save-review', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getProductReviews: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-product-reviews', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      saveAddress: function (address) {
        return $http.post(Config.ENV.SERVER_URL + 'user/save-address', address, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      setDefaultAddress: function (id) {
        var address = {};
        address.addressId = id;
        return $http.post(Config.ENV.SERVER_URL + 'user/set-default-addresses', address, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getAddresses: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-addresses', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getDefaultAddress: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-default-addresses', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getUserEmailAndPhone: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-user-email-phone', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      setUserEmailAndPhone: function (email) {
        return $http.post(Config.ENV.SERVER_URL + 'user/set-user-email-phone', email, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      deactivateAddress: function (id) {
        var address = {};
        address.addressId = id;
        return $http.post(Config.ENV.SERVER_URL + 'user/deactivate-address', address, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      checkout: function (cart) {
        return $http.post(Config.ENV.SERVER_URL + 'user/checkout', cart, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      checkPaymentStatus: function (payKey) {
        var obj = {};
        obj.name = payKey;
        return $http.post(Config.ENV.SERVER_URL + 'user/check-payment-status', obj, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getOrderHistory: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-order-details', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getShippingDetails: function (cart) {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-shipment', cart, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      getFAQ: function () {
        return $http.get('http://res.cloudinary.com/duqhan/raw/upload/v1488785100/support/support.json');
      },
      cancelOrd: function (order) {
        return $http.post(Config.ENV.SERVER_URL + 'user/cancel-order', order, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      uploadReturnImage: function (data, successCallback, errorCallback) {
        $.ajax({
          url: Config.ENV.SERVER_URL + "user/order/request_return",
          type: "POST",
          data:  data,
          contentType: false,
          processData:false,
          success: successCallback,
          error: errorCallback
        });
      },
      contactUs: function (details) {
        return $http.post(Config.ENV.SERVER_URL + 'user/contact-us', details);
      },
      contactUsPublic: function (details) {
        return $http.post(Config.ENV.SERVER_URL + 'web/contact-to-admin', details);
      },
      getFreeProducts: function () {
        return $http.post(Config.ENV.SERVER_URL + 'user/get-free-product', {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      searchAutoComplete: function (param) {
       // return $http.get('dummy/products.json');
       return $http.post(Config.ENV.SERVER_URL + 'user/search-autoComplete', param, {
         transformResponse: function (response) {
           var data = JSON.parse(response);
           return data;
         }
       });
     },
      saveRecentRecord: function (param) {
        return $http.post(Config.ENV.SERVER_URL + 'user/save-recent-record', param, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      purchaseFreeProduct: function (cart) {
        return $http.post(Config.ENV.SERVER_URL + 'user/accept-free-product-offer', cart, {
          transformResponse: function (response) {
            var data = JSON.parse(response);
            return data;
          }
        });
      },
      uploadImage: function (userId, data, successCallback, errorCallback) {
        $.ajax({
          url: Config.ENV.SERVER_URL + "user/update-profile-image/"+userId,
          type: "POST",
          data:  data,
          contentType: false,
          processData:false,
          success: successCallback,
          error: errorCallback
        });
      }
    };
  });
