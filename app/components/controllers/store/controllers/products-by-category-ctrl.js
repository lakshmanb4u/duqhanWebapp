'use strict';
angular
  .module('store')
  .controller('ProductsByCategoryCtrl', function (
    $log,
    $stateParams,
    $state,
    $rootScope,
    $scope,
    Store,
    $ionicScrollDelegate,
    $ionicSideMenuDelegate,
    $ionicSlideBoxDelegate,
    Product,
	Config,
    BusyLoader
) {
    $log.log(
		'Hello from your Controller: ProductsByCategoryCtrl in module store:. This is your controller:',
		this
    );

    /* Storing contextual this in a variable for easy access */

    var ctrl = this;

    $ionicSideMenuDelegate.canDragContent(false);

    /*----------  Storing url parameter (product id) in scope ----------*/

    ctrl.categoryId = $stateParams.categoryId;
    ctrl.otherCategory = $stateParams.otherCategory;
	ctrl.showNoProducts = "";
	ctrl.isNoProducts = false;


    /*----------  Initialize products object  ----------*/

    ctrl.products = [];
    ctrl.start = 0;
    ctrl.page = 0;
	ctrl.noMoreItemsAvailable = false;
	ctrl.busyInLoading = false;
		ctrl.initialize = false;
		ctrl.breadcrums = [];
		ctrl.symbol = "";
		ctrl.filterHundred = 0;
		ctrl.filterThousand = 0;

    /*==================================================
    Section: Slider button to navigate throuh images
    ==================================================*/
    ctrl.swiper = {};
    $scope.next = function () {
		ctrl.swiper.slideNext();
    };
    $scope.onReadySwiper = function (swiper) {
		$log.log('onReadySwiper');
		swiper.on('slideChangeStart', function () {
			$log.log('slideChangeStart');
			// ctrl.swiper.initObservers();
		});
    };
    /*==================================================
    End: Slider button to navigate throuh images
    ==================================================*/

    /*=================================================
  =            Show products by category            =
  =================================================*/

    /*----------  Get products by category  ----------*/
    ctrl.loadpriceFilter = function () {
    	var obj = {};
    	Store.getPriceFilter(obj)
    	.then(function (data) {
    		ctrl.priceFilterObj = data.data;
    		ctrl.filterHundred = ctrl.priceFilterObj.fiveHundred;
    		ctrl.filterThousand = ctrl.priceFilterObj.thousand;
    		ctrl.symbol = ctrl.priceFilterObj.symbol;
    		console.log("=============",ctrl.priceFilterObj);
    	})
    	.catch(function (response) {
			$log.log(response);
			BusyLoader.hide();
    	});
    };
    ctrl.loadpriceFilter();
    ctrl.loadProductListByCategory = function () {
			console.log("by category............");
			ctrl.busyInLoading = true;
		ctrl.showStatus = false;
		var productsParam = {
			start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
			limit: Config.ENV.PRODUCTS_PER_PAGE,
			isRecent: false,
			categoryId: ctrl.categoryId,
		};
		
		var s = new Date().getTime();
		Product.getProductList(productsParam)
        .then(function (data) {
        	var e = new Date().getTime();
            var t = e-s;
            console.log("total time taken",t);
            Store.awsCloudWatch('JS Web Get product','JS Web get-product',t);
			/* Randoize items */
			if(data.products != null) {
				data.products.sort(function () {
					return 0.5 - Math.random();
				});
				ctrl.products = ctrl.products.concat(data.products);
			}
				
			ctrl.page++;
			ctrl.productCategory = data.categoryName;
			BusyLoader.hide();
			ctrl.showStatus = true;
			ctrl.busyInLoading = false;
			console.log("success.........",data);
			if(ctrl.products == null || ctrl.products.length == 0){
				ctrl.showNoProducts = "No products found...";
				ctrl.isNoProducts = true;
				ctrl.busyInLoading = true;
			} else {
				ctrl.showNoProducts = "";
				ctrl.isNoProducts = false;
				if(data.products == null || data.products.length == 0) {
					ctrl.busyInLoading = true;
				  } else {
					ctrl.busyInLoading = false;
				  }
			}
        })
        .catch(function (response) {
			$log.log(response);
			BusyLoader.hide();
        });
    };

    /*----------  Load more products  ----------*/
    ctrl.loadMore = function () {
			console.log("load more............",ctrl.start,ctrl.page);
		if (ctrl.busyInLoading) return;
			//ctrl.noMoreItemsAvailable = true;
			$scope.$broadcast('scroll.infiniteScrollComplete');
			if ($state.current.name === 'store.productsByCategory') {
				if(angular.isUndefined($stateParams.otherCategory) || $stateParams.otherCategory == '') {
					ctrl.loadProductListByCategory();
					ctrl.loadChildCategories();
				} else {
					var productsParam = {};
					
					if($stateParams.otherCategory == "recent") {
						productsParam = {
							start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
							limit: Config.ENV.PRODUCTS_PER_PAGE,
							isRecent: true,
							categoryId: null,
							lowPrice:ctrl.lowPrice,
							highPrice:ctrl.highPrice
						};
					}
					if($stateParams.otherCategory == "popular") {
						productsParam = {
							start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
							limit: Config.ENV.PRODUCTS_PER_PAGE,
							isRecent: false,
							categoryId: null,
							lowPrice:ctrl.lowPrice,
							highPrice:ctrl.highPrice
						};
					}
					if($stateParams.otherCategory == "latest") {
						productsParam = {
							start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
							limit: Config.ENV.PRODUCTS_PER_PAGE,
							isRecent: false,
							categoryId: null,
							lowPrice:ctrl.lowPrice,
							highPrice:ctrl.highPrice
						};
					}
					ctrl.loadProductListByCategoryParam(productsParam);
				}
			}
		
    };

    ctrl.goToProductDetailsPage = function (evt, productId) {
		if (evt.which === 1) {
			$state.go('store.overview', { productId: productId });
		}
    };

    /*=====  End of Show products by category  ======*/

    /*===============================================
  =            Show category list page            =
  ===============================================*/

    ctrl.loadChildCategories = function () {
    		var s = new Date().getTime();
			Product.getChildCategoriesById(ctrl.categoryId)
			.then(function (data) {
				var e = new Date().getTime();
          		var t = e-s;
          		Store.awsCloudWatch('JS Web Get category','JS Web get-child-category',t);
				ctrl.categories = data.categoryDtos;
				ctrl.breadcrums = data.breadcrums;
				$log.log('Breadcrums :', ctrl.breadcrums);
				if(ctrl.categories != null){
					for( var index = 0; index < ctrl.categories.length; index++){
					ctrl.categories[index].isChecked = false;
					} 
					//document.getElementById("categoryfilterDropdown").classList.add("show");
				}
				//ctrl.swiper.initObservers();
			})
			.catch(function (response) {
				$log.log(response);
			});
    };

    /*----------  call the function at the time of initialization  ----------*/
/*
    if ($state.current.name === 'store.categories' && ctrl.otherCategory == undefined) {
		ctrl.loadChildCategories();
    }*/

    /*$rootScope.$on('latestCategoryType', function (event, toState) {
      $log.log(event);
      console.log(toState);
    });*/

    /*----------  call the function at the time of initialization  ----------*/

    /*if ($state.current.name === 'store.productsByCategory') {
			console.log("state current name called.......");
		if (!ctrl.initialize) {
			ctrl.initialize = true;
			ctrl.loadProductListByCategory();
			ctrl.loadChildCategories();
		}
    }*/

    /*----------  Get the products depending on which page user is in  ----------*/

    /*$rootScope.$on('$stateChangeSuccess', function (event, toState) {
			console.log('state change success called............');
		$ionicScrollDelegate.scrollTop();
		ctrl.products = [];
		ctrl.start = 0;
		ctrl.page = 0;
		ctrl.noMoreItemsAvailable = false;
		if (toState.name === 'store.productsByCategory') {
			ctrl.initialize = true;
			ctrl.loadProductListByCategory();
			ctrl.loadChildCategories();
		}
    });*/

    /*=====  End of Show category list page  ======*/

    ctrl.childCategoryId = '';
    ctrl.check = function(category) {
		$log.log('Category : ', category);
		for( var index = 0; index < ctrl.categories.length; index++){
			$log.log('Category : ', ctrl.categories[index]);
			if(category.categoryId == ctrl.categories[index].categoryId){
				ctrl.categories[index].isChecked = true;
				ctrl.childCategoryId = category.categoryId;
			} else {
				ctrl.categories[index].isChecked = false;
			}
		}
		ctrl.apply();
    }

    ctrl.apply = function() {
      $state.go('store.productsByCategory', { categoryId: ctrl.childCategoryId,otherCategory:''});      
    }
    
    ctrl.latest = false;
    ctrl.popular = false;
    ctrl.recent = false;

    ctrl.loadProductListByCategoryParam = function (productsParam) {
			console.log("by param called.......",productsParam);
		ctrl.showStatus = false;
		ctrl.busyInLoading = true;
		//ctrl.products = [];
		var s = new Date().getTime();
		Product.getProductList(productsParam)
        .then(function (data) {
			/* Randoize items */
			var e = new Date().getTime();
            var t = e-s;
            console.log("total time taken",t);
            Store.awsCloudWatch('JS Web Get product','JS Web get-product',t);
			if(data.products != null) {
				data.products.sort(function () {
					return 0.5 - Math.random();
				});
				console.log("concat called.....................");
				ctrl.products = ctrl.products.concat(data.products);
			}
			
			ctrl.page++;
			ctrl.productCategory = data.categoryName;
			//BusyLoader.hide();
			ctrl.showStatus = true;
			ctrl.busyInLoading = false;
			if(ctrl.products == null || ctrl.products.length == 0){
				ctrl.showNoProducts = "No products found...";
				ctrl.isNoProducts = true;
				ctrl.busyInLoading = true;
			} else {
				ctrl.showNoProducts = "";
				ctrl.isNoProducts = false;
				if(data.products == null || data.products.length == 0) {
					ctrl.busyInLoading = true;
				  } else {
					ctrl.busyInLoading = false;
				  }
			}
			console.log("by param success.........",data);
        })
        .catch(function (response) {
			$log.log(response);
			//BusyLoader.hide();
        });
    };
	
	ctrl.sortBy =  function(sortMethod) {
		console.log('filter called..........'+sortMethod+".........");
		var productsParam = {};
		ctrl.page = 0;
		if(sortMethod == 'recent'){
			ctrl.popular = false;
			ctrl.recent = true;
			ctrl.latest = false;
			productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: true,
				categoryId: null
			};
		} else if (sortMethod == 'latest') {
			ctrl.popular = false;
			ctrl.recent = false;
			ctrl.latest = true;
			productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: null
			};
		} else if (sortMethod == 'popular') {
			ctrl.popular = true;
			ctrl.recent = false;
			ctrl.latest = false;
			productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: null
			};
		}
			ctrl.loadProductListByCategoryParam(productsParam);
	}

	ctrl.showPriceFilter = true;
	if(ctrl.otherCategory == "popular" || ctrl.otherCategory == "latest" || ctrl.otherCategory == "recent"){
		ctrl.noMoreItemsAvailable = true;
		if(ctrl.otherCategory == "popular") {
			$("#popularRadio").attr("checked",true);
			$("#below_500").attr("checked",true);
			ctrl.showPriceFilter = false;
		}  
		if(ctrl.otherCategory == "latest") {
			$("#latestRadio").attr("checked",true);
			$("#below_500").attr("checked",true);
			ctrl.showPriceFilter = false;
		}
		if(ctrl.otherCategory == "recent") {
			$("#recentRadio").attr("checked",true);
			ctrl.showPriceFilter = true;
		} 
    	ctrl.sortBy(ctrl.otherCategory);
    }

    ctrl.belowFiveHundred = function (){
    	$("#below_1000").attr("checked",false);
    	$("#above_1000").attr("checked",false);
    	var productsParam = {};
		ctrl.page = 0;
		ctrl.products = [];
		ctrl.lowPrice = '1';
		ctrl.highPrice = '500';
    	if(ctrl.otherCategory == "popular" || ctrl.otherCategory == "latest"){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: null,
				lowPrice:'1',
				highPrice:'500'
			};
		
    	}else if(ctrl.otherCategory == "recent"){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: true,
				categoryId: null,
				lowPrice:'1',
				highPrice:'500'
			};
    	}else if(ctrl.categoryId){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: $stateParams.categoryId,
				lowPrice:'1',
				highPrice:'500'
			};
		}
    	ctrl.loadProductListByCategoryParam(productsParam);
    }
	ctrl.belowThousand = function (){
		$("#below_500").attr("checked",false);
    	$("#above_1000").attr("checked",false);
		var productsParam = {};
		ctrl.page = 0;
		ctrl.products = [];
		ctrl.lowPrice = '500';
		ctrl.highPrice = '1000';
    	if(ctrl.otherCategory == "popular" || ctrl.otherCategory == "latest"){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: null,
				lowPrice:'500',
				highPrice:'1000'
			};
		
    	}else if(ctrl.otherCategory == "recent"){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: true,
				categoryId: null,
				lowPrice:'500',
				highPrice:'1000'
			};
    	}else if(ctrl.categoryId){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: $stateParams.categoryId,
				lowPrice:'500',
				highPrice:'1000'
			};
		}
    	ctrl.loadProductListByCategoryParam(productsParam);
    }
    ctrl.aboveThousand = function (){
    	$("#below_500").attr("checked",false);
    	$("#below_1000").attr("checked",false);
    	var productsParam = {};
		ctrl.page = 0;
		ctrl.products = [];
		ctrl.lowPrice = '1000';
		ctrl.highPrice = '9999999';
    	if(ctrl.otherCategory == "popular" || ctrl.otherCategory == "latest"){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: null,
				lowPrice:'1000',
				highPrice:'9999999'
			};
		
    	}else if(ctrl.otherCategory == "recent"){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: true,
				categoryId: null,
				lowPrice:'1000',
				highPrice:'9999999'
			};
    	}else if(ctrl.categoryId){
    		productsParam = {
				start: ctrl.start + ctrl.page * Config.ENV.PRODUCTS_PER_PAGE,
				limit: Config.ENV.PRODUCTS_PER_PAGE,
				isRecent: false,
				categoryId: $stateParams.categoryId,
				lowPrice:'1000',
				highPrice:'9999999'
			};
		}
    	ctrl.loadProductListByCategoryParam(productsParam);
    }

	ctrl.clearPrice = function(){
		console.log("clear price called",ctrl.categoryId,$stateParams.otherCategory);
		if(angular.isUndefined($stateParams.otherCategory) || $stateParams.otherCategory == '') {
			$state.go('store.productsByCategory', { categoryId: ctrl.categoryId},{reload: true});
		} else {
			$state.go('store.productsByCategory',{otherCategory: $stateParams.otherCategory},{reload: true});
		}
	}
	ctrl.goToCataegory = function(categoryId) {
		$log.log('Here in gotoCategory');
		$state.go('store.productsByCategory', { categoryId: categoryId});      
	}

	ctrl.gotToCat = function (toState) {
		$state.go('store.productsByCategory',{otherCategory: toState});
		
	  }
});
