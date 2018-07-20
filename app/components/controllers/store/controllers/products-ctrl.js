'use strict';
angular
  .module('store')
  .controller('ProductsCtrl', function (
    $log,
    $rootScope,
    $timeout,
    $ImageCacheFactory,
    $state,
    $scope,
    $ionicScrollDelegate,
    $localStorage,
    BusyLoader,
    Store,
    Product,
    Config,
    $http
  ) {
    /* Storing contextual this in a variable for easy access */

    var ctrl = this;

   
    $log.log(
      'Hello from your Controller: ProductsCtrl in module store:. This is your controller:',
      ctrl
    );
    
    ctrl.products = [];
    ctrl.bestProduct = [];
    ctrl.start = 0;
    ctrl.page = 0;
    ctrl.noMoreItemsAvailable = false;
    ctrl.categoryId = 0;

    ctrl.stateCheck = function (state) {
      console.log(state);
    };

    /*----------  Get list of products from backend  ----------*/

    ctrl.loadProductList = function (productsParam) {
		if (ctrl.products.length === 0) {
			BusyLoader.show();
		}
		var d = new Date();
		var products = [];
		var s = new Date().getTime();
		console.log("start time",s);
		Store.getProducts(productsParam)
		.then(function (response) {
			var e = new Date().getTime();
            var t = e-s;
            console.log("total time taken",t);
            Store.awsCloudWatch('JS Web Get product','JS Web get-product',t);
			$log.log(response);
			products = response.data.products;
			ctrl.productCategory = response.data.categoryName;
			// return $ImageCacheFactory.Cache(response.data.allImages);
			return;
		})
		.then(function () {
			if($state.includes('store')){
				for(var index=0; index < products.length && index < 12 ; index++){
					if(index > 4 && index < 11){
						ctrl.bestProduct.push(products[index]);
					}
					ctrl.products.push(products[index]);
				}
			} else {
				ctrl.products = ctrl.products.concat(products);
			}
			$log.log('products : ', ctrl.products );
			ctrl.page++;
			if (products.length > 0) {
				ctrl.noMoreItemsAvailable = false;
			}
			BusyLoader.hide();
		})
		.catch(function (response) {
			$log.log(response);
			BusyLoader.hide();
		});
    };


    ctrl.goToProductDetailsPage = function (evt, productId) {
		if (evt.which === 1) {
			$state.go('store.overview', { productId: productId });
		}
    };

    /*----------  Get latest products  ----------*/

    ctrl.loadLatestProductList = function () {
		var productsParam = {
			start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
			limit: Config.ENV.PRODUCTS_PER_PAGE,
			isRecent: false,
			categoryId: null
		};
		ctrl.loadProductList(productsParam);
    };
    if($localStorage.countryCode){
      ctrl.loadLatestProductList();
    }else{
    	$http.get('https://api.ipdata.co')
     	.success(function(data) {
        $localStorage.countryCode = data.country_code;
        ctrl.loadLatestProductList();
    	})
     	.error(function(data){
     	$localStorage.countryCode = "IN";
        ctrl.loadLatestProductList();
     	});
    }

	
	//categories
	ctrl.categories = {};
	ctrl.categoryId = 0;
    ctrl.loadChildCategories = function () {
		ctrl.categories = $rootScope.topLevelMenu;
		// Product.getChildCategories(ctrl.categoryId)
		// .then(function (categories) {
		// 	ctrl.categories = categories;	
		// 	$log.log('Categories in response : ', categories);
	 	setTimeout(function(){
			$("#owl-demo").slick({
				dots: false,
				autoplay: true,
				autoplaySpeed: 2000,
				centerMode: true,
				slidesToShow: 5,
				slidesToScroll:1
			})
	 	}, 1500)
		// })
		// .catch(function (response) {
		// 	$log.log(response);
		// });
    };
    /*$scope.$watch(function(){
    	return $rootScope.topLevelMenu;
    },ctrl.loadChildCategories)*/
    $rootScope.loadChildCategories_global=ctrl.loadChildCategories;
    if($rootScope.loadCategoryFlag){
    	ctrl.loadChildCategories();
    }

  });
angular
  .module('store').filter('currencySymbol', function ($filter) {
	   return function(amount, currency) {
	       return $filter('currency')(amount, currency_symbols[currency]);
	   }
	});

	var currency_symbols = {
	   'USD': '$', // US Dollar
	   'EUR': '€', // Euro
	   'GBP': '£', // British Pound Sterling
	   'ILS': '₪', // Israeli New Sheqel
	   'INR': '₹', // Indian Rupee
	   'JPY': '¥', // Japanese Yen
	   'KRW': '₩', // South Korean Won
	   'NGN': '₦', // Nigerian Naira
	   'PHP': '₱', // Philippine Peso
	   'PLN': 'zł', // Polish Zloty
	   'PYG': '₲', // Paraguayan Guarani
	   'THB': '฿', // Thai Baht
	   'UAH': '₴', // Ukrainian Hryvnia
	   'VND': '₫', // Vietnamese Dong
	   'KWD': 'د.ك',
	};
