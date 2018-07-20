'use strict';
angular.module('store')
  .controller('StoreMenuCtrl', function (
    $log,
    $location,
    $ionicAuth,
    $localStorage,
    $ionicFacebookAuth,
    $rootScope,
    $timeout,
	  $state,
	  $stateParams,
    $ionicSideMenuDelegate,
	  $scope,
    Config,
    Auth,
    Store,
    $window,
    Product
  ) {

    /* Storing contextual this in a variable for easy access */
    /*comment*/
    var ctrl = this;
    ctrl.user = {};
    ctrl.isSideNavOpen = false;
    document.getElementById("body").classList.remove('authenticate');
    document.getElementById("body").classList.remove('landing');
    ctrl.openNav = function($event) {
        $log.log('Here');
        ctrl.isSideNavOpen = true;
        //ctrl.user = JSON.parse(JSON.parse(localStorage.getItem('ngStorage-savedUser')));
        ctrl.user = JSON.parse($localStorage.savedUser);
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("main").style.transition = "margin-left .5s";
        document.getElementById("header-main").style.marginLeft = "143px";
        document.getElementById("header-main").style.transition = "margin-left .5s";
        document.getElementById("footer-main").style.marginLeft = "250px";
        document.getElementById("footer-main").style.transition = "margin-left .5s";
        if(document.getElementById("bread-main") != null) {
          document.getElementById("bread-main").style.marginLeft = "144px";
          document.getElementById("bread-main").style.transition = "margin-left .5s";
        }
        document.getElementById("full").style.width = "100%";
        $event.stopPropagation();
    }

    ctrl.closeNav = function() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
        document.getElementById("header-main").style.marginLeft= "0";
        document.getElementById("footer-main").style.marginLeft= "0";
        if(document.getElementById("bread-main") != null) {
          document.getElementById("bread-main").style.marginLeft= "0";
        }
        document.getElementById("full").style.width = "";
    }

    $log.log('Hello from your Controller: StoreMenuCtrl in module store:. This is your controller:', ctrl);
    if (angular.isUndefined($localStorage.savedUser)) {
        $state.go('landing', {next_url: $localStorage.url});
    }
    /*==============================
    =            Logout            =
    ==============================*/
    ctrl.login = function () {
      if ($localStorage.savedUser) {
        var savedUser = JSON.parse($localStorage.savedUser);
        if (savedUser.email === 'guest@gmail.com') {
          $localStorage.$reset();
          $state.go('landing');
        }
      }
    };
    ctrl.logout = function () {
		$log.log('Hi Logout');
      if ($localStorage.savedUser) {
        var savedUser = JSON.parse($localStorage.savedUser);
        if (savedUser.email === 'guest@gmail.com') {
          $localStorage.$reset();
          $state.go('landing');
         }else{
          if (savedUser.socialLogin) {
          $ionicFacebookAuth.logout();
        }
         var s = new Date().getTime();
          Auth.logout(savedUser)
            .then(function (response) {
            var e = new Date().getTime();
            var t = e-s;
            Store.awsCloudWatch('JS Web Logout','JS Web logout',t);
              $log.log(response);
              $localStorage.$reset();
        $location.path('/landing');
            })
          .catch(function (response) {
            $log.log(response);
            if (response.data.statusCode === '403') {
              ctrl.responseCB = 'Invalid credential.';
            } else {
              ctrl.responseCB = 'Something went wrong. Please try again.';
            }
          });
         }
        
      } else {
        $location.path('/landing');
      }
    };

    $window.onbeforeunload = function (evt) {
      console.log("event value",evt);
        $localStorage.$reset();
        ctrl.logout();
    }
    /*=====  End of Logout  ======*/


    /*==============================================================
    =            Get the number of items in user's cart            =
    ==============================================================*/

    ctrl.getCartTotalNumber = function () {
      var s = new Date().getTime();
      Store.getCartTotalNumber()
        .then(function (response) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Get cart count','JS Web get-cart-count',t);
          $log.log(response.data);
          ctrl.cartTotalNumber = response.data.cartCount;
        })
        .catch(function (response) {
          $log.log(response);
        });
    };


    /*----------  call the function at the time of initialization  ----------*/

    ctrl.getCartTotalNumber();


    /*----------  catching calls from outside of this controller  ----------*/

    $rootScope.$on('getCartTotalNumber', function (event) {
      $log.log(event);
      ctrl.getCartTotalNumber();
    });

    /*=====  End of Get the number of items in user's cart  ======*/


    /*==========================================================================
    =            Include user's name and image in scope to display in sidebar            =
    ==========================================================================*/

    ctrl.setUserDetailForMenu = function () {
      console.log("image url......",Config.ENV.USER.PROFILE_IMG);
      ctrl.user.name = Config.ENV.USER.NAME;
      ctrl.user.profileImage = Config.ENV.USER.PROFILE_IMG;
      $("#profile_img").attr("src", Config.ENV.USER.PROFILE_IMG);
      ctrl.guest = true;
      if ($localStorage.savedUser) {
        var savedUser = JSON.parse($localStorage.savedUser);
        if (savedUser.email === 'guest@gmail.com') {
          ctrl.guest = false;
        }
      }
    };

    var destroyFun = $rootScope.$on('setUserDetailForMenu', function (event) {
      console.log("set user detail for menu called.............");
      $log.log(event);
      ctrl.setUserDetailForMenu();
      destroyFun();
    });
    ctrl.guest = true;
    if ($localStorage.savedUser) {
      var savedUser = JSON.parse($localStorage.savedUser);
      if (savedUser.email === 'guest@gmail.com') {
        ctrl.guest = false;
      }
    }

    /*=====  End of Include user's name and image in scope to display in sidebar  ======*/

    /*================================================================
    =            Showing server side notification message            =
    ================================================================*/

    ctrl.notification = {};

    ctrl.setNotification = function (notification) {
      ctrl.notification.type = notification.type;
      ctrl.notification.text = notification.text;
      $timeout(function () {
        ctrl.notification = {};
      }, 5000);
    };

    /*----------  catching calls from outside of this controller  ----------*/

    $rootScope.$on('setNotification', function (event, notification) {
      $log.log(event);
      ctrl.setNotification(notification);
    });

    ctrl.activeTab = '';
    ctrl.getActiveclass = function (name, statevalue) {
      if (ctrl.activeTab === name && statevalue) {
        return 'active';
      }
      return '';
    };

    ctrl.gotToCat = function (toState) {
      $state.go('store.productsByCategory',{otherCategory: toState});
      ctrl.activeTab = toState;
    }

    /*=====  End of Showing server side notification message  ======*/

    /*================================================
    =            Getting top level menu            =
    ================================================*/

   /* ctrl.getTopLevelMenu = function () {
      Product.getChildCategories(0)
        .then(function (response) {
          $log.log(response.data);
          ctrl.topLevelMenu = response;
        })
        .catch(function (response) {
          $log.log(response);
        });
    };*/

    //ctrl.getTopLevelMenu();

    /*=====  End of Getting top level menu  ======*/

    /*============================================
    =            Show hide search bar            =
    ============================================*/

    $rootScope.searcBarActive = false;
    ctrl.toggleSearchBar = function () {
      $rootScope.searcBarActive = !$rootScope.searcBarActive;
    };

    ctrl.searchProduct = function () {
      ctrl.toggleSearchBar();
      $log.log(ctrl.searchText);
      $state.go('store.productsSearch', { searchText: ctrl.searchText });
    };

    /*=====  End of Show hide search bar  ======*/

    $rootScope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $rootScope.$on('Unauthorized', function () {
      $state.go('landing');
      var notification = {};
      notification.type = 'failure';
      notification.text = 'Your session has expired. Please login again.';
      $rootScope.$emit('setUnauthorizedNotification', notification);
    });

    /*==================================================
    Section: Overlay on open Menu
    ==================================================*/
    ctrl.isMenuOpen = false;
    $scope.$watch(function () {
      return $ionicSideMenuDelegate.getOpenRatio();
    },
      function (ratio) {
        if (ratio === 1) {
          ctrl.isMenuOpen = true;
        } else {
          ctrl.isMenuOpen = false;
        }
      });
    /*==================================================
    End: Overlay on open Menu
    ==================================================*/

    /* Categories  */  

	ctrl.categories = {};
	ctrl.categoryId = 0;
	ctrl.isPresent = false;
    ctrl.loadChildCategories = function () {
    var s = new Date().getTime();  
		Product.getChildCategories(ctrl.categoryId)
		.then(function (categories) {
      if (ctrl.categoryId == 0){
        $rootScope.topLevelMenu = categories;
        $rootScope.loadCategoryFlag = true;
        $rootScope.loadChildCategories_global();
        ctrl.topLevelMenu = categories;
      }
      var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Get cart count','JS Web get-cart-count',t);
			ctrl.categories = categories;
			ctrl.categoryId = $state.params.categoryId;
			if(ctrl.categories != null){
				for(var index = 0; index < ctrl.categories.length; index++){
					if(ctrl.categoryId  == ctrl.categories[index].categoryId){
						ctrl.isPresent = true;
						break;
					}
				}
				if(!ctrl.isPresent){
					ctrl.categoryId = 0;
				}
			} else {
				ctrl.categoryId = 0;
			}	
			$log.log('Categories in response : ', categories);
		})
		.catch(function (response) {
			$log.log(response);
		});
    };

    ctrl.callCategories = function () {
      ctrl.products = {};
      $state.go('store.productsByCategory', { categoryId: ctrl.categoryId});      
		//ctrl.loadProductListByCategory();
    };

    ctrl.loadProductListByCategory = function () {
		var productsParam = {
			start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
			limit: Config.ENV.PRODUCTS_PER_PAGE,
			isRecent: false,
			categoryId: ctrl.categoryId
		};
    var s = new Date().getTime();
		Product.getProductList(productsParam)
        .then(function (data) {
			/* Randoize items */
      var e = new Date().getTime();
      var t = e-s;
      Store.awsCloudWatch('JS Web Get product','JS Web get-product',t);
			ctrl.products = data.products;
			ctrl.page++;
			if (data.products.length > 0) {
				ctrl.noMoreItemsAvailable = false;
			}
        })
        .catch(function (response) {
			$log.log(response);
        });
    };

	ctrl.loadChildCategories();
	
	ctrl.init = function() {
		if($state.includes('store.productsByCategory')) {
			ctrl.categoryId = $state.params.categoryId;
		}
	}

ctrl.autoCompleteList = [];
  ctrl.autoCompleteOptions = {
            minimumChars: 1,
            dropdownWidth: '250px',
            maxItemsToRender: 10,
            data: function (searchText) {
              var param = {name:searchText};
              return Product.searchAutoComplete(param)
              .then(function (response) {
                  /*searchText = searchText.toUpperCase();
                  var products = _.filter(response, function (product) {
                      return product.name.startsWith(searchText);
                  });*/
                  ctrl.autoCompleteList = response;
                  return _.map(response, 'name');
              });
            },
            itemSelected: function (e) {
                ctrl.callSearchText('autoComplete');
            }
        }

	ctrl.init();
	ctrl.searchText = '';
    ctrl.callSearchText = function (type) {
		$log.log('Hi how are you ?', ctrl.categoryId);
		ctrl.products = {};
    if (ctrl.searchText == "" || angular.isUndefined(ctrl.searchText)) {
    $state.go('store.searchNotFound', { searchText: ctrl.searchText });
    } else { 
        ctrl.isChecked = false;
          for(var i=0;i<ctrl.autoCompleteList.length;i++) {
          if(ctrl.autoCompleteList[i].name == ctrl.searchText) {
            if(ctrl.autoCompleteList[i].category == true) {
              ctrl.isChecked = true;
              $state.go('store.productsByCategory', { categoryId: ctrl.autoCompleteList[i].id});
              break;
            } else {
              ctrl.isChecked = true;
              $state.go('store.productsSearch', { searchText: ctrl.searchText});
              break;
            }
          }
        } 
        if(type == "search" && ctrl.isChecked == false) {
          $state.go('store.productsSearch', { searchText: ctrl.searchText});
        } 
		}//ctrl.loadProductListByCategory();
    };

    ctrl.onLockImgHover = function() {
      $('.hovered-msg').css({"visibility":"visible"});
    }

    ctrl.onLockImgMouseLeave = function() {
      $('.hovered-msg').css({"visibility":"hidden"});
    }
});
