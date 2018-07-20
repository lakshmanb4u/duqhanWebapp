'use strict';
angular
  .module('main')
  .factory('HttpInterceptor', function (
    BusyLoader,
    $q,
    Config,
    $localStorage,
    $window,
    $rootScope
  ) {
    var loadingCount = 0;
    return {
      request: function (config) {
        if (!Config.ENV.USER.AUTH_TOKEN) {
          var savedUser = $localStorage.savedUser;
          if (savedUser && JSON.parse(savedUser)) {
            var parsedUser = JSON.parse(savedUser);
            if (parsedUser.authtoken) {
              Config.ENV.USER.AUTH_TOKEN = parsedUser.authtoken;
              Config.ENV.USER.NAME = parsedUser.name;
            }
          }
        }
        if (
          config.url.indexOf(Config.ENV.SERVER_URL + 'user') === 0 &&
          Config.ENV.USER.AUTH_TOKEN
        ) {

          config.headers['X-Auth-Token'] = Config.ENV.USER.AUTH_TOKEN;
          config.headers['X-Country-Code']=$localStorage.countryCode;
        }
        if (++loadingCount === 1) {
          $rootScope.$broadcast('loading:progress');
          if (
            !(config.url.indexOf(Config.ENV.SERVER_URL + 'user/get-product') ===
              0 && config.data.start > 0) && config.url.indexOf('.html') < 0
          ) {
            //BusyLoader.show();
            if (
              !(config.url.indexOf(Config.ENV.SERVER_URL + 'user/search-product') ===
                0 && config.data.start > 0) && config.url.indexOf('.html') < 0
            ) {
              if (
                !(config.url.indexOf(Config.ENV.SERVER_URL + 'user/get-order-details') ===
                  0 && config.data.start > 0) && config.url.indexOf('.html') < 0
              ) {
                  if (
                  !(config.url.indexOf(Config.ENV.SERVER_URL + 'user/search-autoComplete') ===
                    0) && config.url.indexOf('.html') < 0
                ) {
                      $('#loaderImg').show();
                      $('#body').fadeTo(0, 0.4);
                     // $window.scrollTo(0, 0);
                      $('#body').css("overflow", "hidden");
                      $('#body').css("pointer-events", "none");
                    }
                } else {
                  if(config.url.indexOf(Config.ENV.SERVER_URL + 'user') === 0 &&
                  Config.ENV.USER.AUTH_TOKEN) {
                    $('#loaderImg').show();
                    $('#body').fadeTo(0, 0.4);
                    $('#body').css("pointer-events", "none");
                  }
                }    
            } else {
              if(config.url.indexOf(Config.ENV.SERVER_URL + 'user') === 0 &&
              Config.ENV.USER.AUTH_TOKEN) {
                $('#loaderImg').show();
                $('#body').fadeTo(0, 0.4);
                $('#body').css("pointer-events", "none");
              }
            }
          } else {
            if(config.url.indexOf(Config.ENV.SERVER_URL + 'user') === 0 &&
            Config.ENV.USER.AUTH_TOKEN) {
              $('#loaderImg').show();
              $('#body').fadeTo(0, 0.4);
              $('#body').css("pointer-events", "none");
            }
          }
        }
        return config;
      },
      response: function (res) {
        if (--loadingCount === 0) {
          $rootScope.$broadcast('loading:finish');
          //BusyLoader.hide();
          $('#loaderImg').hide();
          $('#body').fadeTo(0, 1);
          $('#body').css("overflow", "scroll");
          $('#body').css("pointer-events", "all");
        }
        return res;
      },
      requestError: function (err) {
        return err;
      },
      responseError: function (err) {
        if (err.status === 401) {
          $rootScope.$emit('Unauthorized');
        }
        if (--loadingCount === 0) {
          $rootScope.$broadcast('loading:finish');
          //BusyLoader.hide();
          $('#loaderImg').hide();
          $('#body').fadeTo(0, 1);
          $('#body').css("overflow", "scroll");
          $('#body').css("pointer-events", "all");
        }
        return $q.reject(err);
      }
    };
  });
