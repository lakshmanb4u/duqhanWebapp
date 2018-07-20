'use strict';
angular
.module('store')
.controller('ProductCtrl', function (
$log,
$stateParams,
$ionicSlideBoxDelegate,
$state,
$ionicActionSheet,
$scope,
$rootScope,
$timeout,
$sce,
Store,
$window,
$localStorage,
$location,
Product,
BusyLoader,
$http
) {
    /* Storing contextual this in a variable for easy access */

    var ctrl = this;

    $log.log(
		'Hello from your Controller: ProductCtrl in module store:. This is your controller:',
		ctrl
    );

    if (angular.isUndefined($localStorage.savedUser)) {
    		var url = $state.current.url.replace(':productId', $state.params.productId);
    		$localStorage.url = url;
    		$state.go('landing', {next_url: url});
    }
	/*=============================================
	=            Get product details            =
	=============================================*/

	/*----------  Initialize product object  ----------*/

    ctrl.product = {};

    /*----------  Get details of a product from backend  ----------*/

    
    ctrl.loadProductDetail = function (productId) {
		var productParam = { productId: productId };
		$window.scrollTo(0, 0);
		BusyLoader.show();
		var s = new Date().getTime();
		Store.getProductDetail(productParam)
        .then(function (response) {
        	var e = new Date().getTime();
          	var t = e-s;
          	Store.awsCloudWatch('JS Web Get product details','JS Web get-product-detail',t);
			$log.log(response.data);
			ctrl.product = response.data;
			$log.log(ctrl.images);
			$log.log(ctrl.product.images);
			var sizeArr = [];
			if (ctrl.product.sizes) {
				angular.forEach(ctrl.product.sizes, function (value) {
					sizeArr.push(value.sizeText);
				});
			}
			ctrl.product.sizeArr = sizeArr.toString();
			var colorArr = [];
			if (ctrl.product.sizes) {
				angular.forEach(ctrl.product.colors, function (value) {
					colorArr.push(value.colorText);
				});
			}
			ctrl.product.colorArr = colorArr.toString();
			$ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
			ctrl.productId = ctrl.product.productId;
			ctrl.allSelected = false;
			ctrl.allSelectedArr = [];
			if (ctrl.product.properties.length === 0) {
				ctrl.checkSelectedProperties();
			}
			ctrl.loadChildCategories();
			 /*facebook pixel code*/
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
        fbq('track', 'ViewContent', {
            value: ctrl.product.salesPrice,
            currency: 'INR',
            content_ids: ctrl.product.productId,
            content_type: "product",
          });
      /*facebook pixel code End*/
        })
        .catch(function (response) {
			$log.log(response);
        })
        .finally(function () {
        	BusyLoader.hide();
		});
		var s = new Date().getTime();
		Store.saveRecentRecord(productParam)
		.then(function (response) {
			var e = new Date().getTime();
          	var t = e-s;
          	Store.awsCloudWatch('JS Web Save recent record','JS Web save-recent-record',t);
			console.log("save recent record callled...............");
		})
        .catch(function (response) {
			$log.log(response);
        });
    };


	ctrl.loadChildCategories = function () {
		var s = new Date().getTime();
		Product.getChildCategoriesById(ctrl.product.categoryId)
		.then(function (data) {
			var e = new Date().getTime();
          	var t = e-s;
          	Store.awsCloudWatch('JS Web Get category','JS Web get-child-category',t);
			ctrl.breadcrums = data.breadcrums;
			console.log('Breadcrums :', ctrl.breadcrums);
		})
		.catch(function (response) {
			$log.log(response);
		});
    };

	ctrl.goToCataegory = function(categoryId) {
		$state.go('store.productsByCategory', { categoryId: categoryId});      
	}

    /*----------  Storing url parameter (product id) in scope ----------*/

    ctrl.productId = $stateParams.productId;

    /*----------  call the function at the time of initialization  ----------*/
    ctrl.loadProductDetail($stateParams.productId);
    

    /*=====  End of Get product details  ======*/

    /*==================================================
    Section: Property List
    ==================================================*/
	ctrl.trustAsHtml = function (string) {
		return $sce.trustAsHtml(string);
	};
    // $ionicModal
    //   .fromTemplateUrl('store/templates/product/propertyListModal.html', {
    //     scope: $scope,
    //     animation: 'slide-in-up'
    //   })
    //   .then(function (modal) {
    //     ctrl.propertyListModal = modal;
    //   });
	ctrl.openPropertyList = function (p) {
		ctrl.propertyList = p;
		ctrl.propertyListModal.show();
	};
	ctrl.closePropertyListModal = function () {
		ctrl.propertyListModal.hide();
	};

    ctrl.propertySelected = function (property) {
		// $log.log(property);
		ctrl.propertyList.selectedProperty = property.value;
		ctrl.propertyList.selectedPropertyId = property.id;
		ctrl.checkSelectedProperties();
		ctrl.propertyListModal.hide();
    };

    /*----------  Setting Price after selecting categories  ----------*/
    ctrl.checkSelectedProperties = function () {
		ctrl.allSelectedArr = [];
		ctrl.mapId = null;
		ctrl.discountOfferPct = 0;
		angular.forEach(ctrl.product.properties, function (i) {
			if (i.selectedPropertyId) {
				ctrl.allSelectedArr.push(i.selectedPropertyId.toString());
			}
		});
		if (ctrl.allSelectedArr.length === ctrl.product.properties.length) {
			ctrl.allSelected = true;
			ctrl.setPrice();
		}
    };

    ctrl.setPrice = function () {
		if (ctrl.allSelected) {
			if (ctrl.product.properties.length === 0) {
			// $log.log('============================ START ==============================');
			// $log.log('ADD TO CART');
			// $log.log('============================= END ===============================');
			}
			angular.forEach(ctrl.product.propertiesMapDto, function (p) {
			var pv = p.propertyvalueComposition;
			var pvArr = pv.split('_');
			var commonArr = [];
				angular.forEach(pvArr, function (a) {
					angular.forEach(ctrl.allSelectedArr, function (b) {
						if (a === b) {
							commonArr.push(a);
						}
					});
				});
				//pvArr.splice(- 1, 1);
				$log.log('============================ START ==============================');
				$log.log(ctrl.allSelectedArr.toString());
				$log.log(pvArr.toString());
				$log.log(commonArr.toString());
				$log.log('============================= END ===============================');
				if (ctrl.allSelectedArr.length === commonArr.length) {
					ctrl.product.salesPrice = p.salesPrice;
					ctrl.mapId = p.mapId;
					ctrl.discountOfferPct = 0;
				}
			});
			// if ()
		}
    };
    /*==================================================
    End: Property List
    ==================================================*/

    /*==================================================
    Section: Slider button to navigate throuh images
    ==================================================*/
    ctrl.slideIndex = 0;
	ctrl.nextSlide = function () {
		$ionicSlideBoxDelegate.next();
	};

    ctrl.previousSlide = function () {
		$ionicSlideBoxDelegate.previous();
    };

    ctrl.slideChanged = function (index) {
		ctrl.slideIndex = index;
    };

	/*==================================================
    End: Slider button to navigate throuh images
    ==================================================*/

    /*==========================================================================================
    =            Helping functions to traverse through tabs in product details page            =
    ==========================================================================================*/

    ctrl.gotoDescription = function () {
		$log.log(ctrl.productId);
		$state.go('store.product.description', { productId: ctrl.productId });
    };

    ctrl.gotoRelated = function () {
		$state.go('store.product.related', { productId: ctrl.productId });
    };

    /*=====  End of Helping functions to traverse through tabs in product details page  ======*/

    /*=================================================
    =            Add a product to the cart            =
    =================================================*/

    /*----------  Add to cart - get triggered when user press "Add to Bag" button from the product detail page ----------*/

    ctrl.addToBag = function (product) {
		ctrl.productSelected = {};
		ctrl.productSelected.productId = product.productId;
		$log.log(product);
		if (!product.sizes || !product.sizes.length > 0) {
			return;
		}
		if (product.sizes[0].sizeId) {
			ctrl.sizeModal();
		} else if (product.sizes[0].sizeColorMap[0].colorId) {
			ctrl.productSelected.size = ctrl.product.sizes[0];
			ctrl.colorModal();
		} else {
			ctrl.productSelected.mapId =
			ctrl.product.sizes[0].sizeColorMap[0].mapId;
			ctrl.addToBagPersist(ctrl.productSelected, ctrl.product);
		}
    };

    /*----------  Send the product to the backend which user newly added to the cart  ----------*/

    ctrl.addToBagPersist = function (productSelected, product) {
      // delete productSelected.size;
		$log.log(ctrl.productSelected);
		var s = new Date().getTime();
		Store.addToCart(productSelected)
        .then(function (response) {
        	var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Add to cart','JS Web add-to-cart',t);
			$log.log(response.data);
			if (response.data.status === 'success') {
				productSelected.response = 'Item Added to your Bag!';
				//ctrl.openModal(productSelected, product);
				$rootScope.$emit('getCartTotalNumber');
			} else if (response.data.status === 'Product already added') {
				productSelected.response = 'Item is already in the Bag!';
				//ctrl.openModal(productSelected, product);
			} else {
				ctrl.showAlert = function () {
					var alertPopup = $ionicPopup.alert({
					  title: 'Out of Stock',
					  template: 'Oops! You just missed the last item in stock. It got sold out. Hurry up and purchase the items you like before they get sold out too.'
					});

					alertPopup.then(function () {
						$state.go('store');
					});
				};
				ctrl.showAlert();
			}
        })
        .catch(function (response) {
			$log.log(response);
        });
    };

    ctrl.addToBagNew = function (product) {
    	if ($localStorage.savedUser) {
        var savedUser = JSON.parse($localStorage.savedUser);
        if (savedUser.email === 'guest@gmail.com') {
            $localStorage.$reset();
            var url = $state.current.url.replace(':productId', $state.params.productId);
    		$localStorage.url = url;
    		$state.go('landing', {next_url: url});
         }else {
    		if (ctrl.allSelected) {
				var productSelected = {};
				productSelected.mapId = ctrl.mapId;
				productSelected.discountOfferPct = ctrl.discountOfferPct;
				productSelected.productId = $stateParams.productId;
				var s = new Date().getTime();
				Store.addToCart(productSelected)
				.then(function (response) {
					var e = new Date().getTime();
          			var t = e-s;
          			Store.awsCloudWatch('JS Web Add to cart','JS Web add-to-cart',t);
					$log.log(response.data);
					if (response.data.status === 'success') {
						productSelected.response = 'Item Added to your Bag!';
						//ctrl.openModal(productSelected, product);
						$('.hovered-msg').css({"visibility":"visible"});
						$timeout(function() {$('.hovered-msg').css({"visibility":"hidden"}); }, 5000);
						$rootScope.$emit('getCartTotalNumber');
						  /*facebook pixel code*/
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
				        fbq('track', 'AddToCart', {
            value: ctrl.product.salesPrice,
            currency: 'INR',
            content_ids: ctrl.product.productId,
            content_type: "product",
          });

      /*facebook pixel code End*/
						//angular.element('[ng-controller=StoreMenuCtrl]').scope().getCartTotalNumber();
					} else if (response.data.status === 'Product already added') {
						productSelected.response = 'Item is already in the Bag!';
						//ctrl.openModal(productSelected, product);
					} else {
						ctrl.showAlert = function () {
							// var alertPopup = $ionicPopup.alert({
							//   title: 'Out of Stock',
							//   template: 'Oops! You just missed the last item in stock. It got sold out. Hurry up and purchase the items you like before they get sold out too.'
							// });

							$state.go('store');
							// alertPopup.then(function () {
							// });
						};
						ctrl.showAlert();
					}
				})
				.catch(function (response) {
					$log.log(response);
				});
				// $log.log('============================ START ==============================');
				// $log.log('ADD TO CART');
				// $log.log('============================= END ===============================');
			} else {
				$('#errPop').modal('show');
			}
    	}
    	} 

		
    };

    /*----------  Ionic modal to show the response of addition of the product to the cart  ----------*/

    // $ionicModal
    //   .fromTemplateUrl('components/views/addedToBagModal.html', {
    //     scope: $scope,
    //     animation: 'slide-in-up'
    //   })
    //   .then(function (modal) {
    //     ctrl.modal = modal;
    //   });

	/*ctrl.openModal = function (productSelected, product) {
		ctrl.productSelected = productSelected;
		ctrl.product = product;
		$log.log(ctrl.product);
		$log.log('productSelected=================');
		$log.log(ctrl.productSelected);
		ctrl.modal.show();
	};

	ctrl.closeModal = function () {
		ctrl.modal.hide();
	};*/

    /*----------  Open a Action sheet to select the size of the product  ----------*/

	ctrl.sizeModal = function () {
		var buttons = [];
		angular.forEach(ctrl.product.sizes, function (value) {
			buttons.push({ text: value.sizeText });
		});
		$ionicActionSheet.show({
			buttons: buttons,
			titleText: 'Select size',
			cancelText: 'Cancel',
			cancel: function () {
				// add cancel code..
			},
			buttonClicked: function (index) {
				// $log.log(index);
				// $log.log(ctrl.product.sizes[index]);
				ctrl.productSelected.size = ctrl.product.sizes[index];
				if (ctrl.productSelected.size.sizeColorMap) {
					ctrl.colorModal();
				}
				return true;
			}
		});
	};

    /*----------  Open a Action sheet to select the color of the product  ----------*/

    // $ionicModal
    //   .fromTemplateUrl('store/templates/product/colorModal.html', {
    //     scope: $scope,
    //     animation: 'slide-in-up'
    //   })
    //   .then(function (modal) {
    //     ctrl.colormodal = modal;
    //   });

    ctrl.colorModal = function () {
		ctrl.colorName = ctrl.productSelected.size.sizeColorMap;
		ctrl.colormodal.show();
    };

	ctrl.colorSelected = function (index) {
		ctrl.productSelected.size.sizeColor =
		ctrl.productSelected.size.sizeColorMap[index];
		ctrl.productSelected.mapId = ctrl.productSelected.size.sizeColor.mapId;
		ctrl.closeColorModal();
		$timeout(function () {
			ctrl.addToBagPersist(ctrl.productSelected, ctrl.product);
			return true;
		}, 1000);
	};

    ctrl.closeColorModal = function () {
    	ctrl.colormodal.hide();
    };

    /*=====  End of Add a product to the cart  ======*/

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    	viewData.enableBack = true;
    });

    ctrl.details = true;
    ctrl.goToDetails = function() {
		ctrl.details = true;      
      // document.getElementById('home').classList.add('active');
      // document.getElementById('menu1').classList.remove('active');
    }

    ctrl.goToReview = function() {
		ctrl.details = false;    
		ctrl.getProductReviews();  
      // document.getElementById('home').classList.remove('active');
      // document.getElementById('menu1').classList.add('active');
    }
    ctrl.prop = {};
    ctrl.openPopup = function (property) {
    	ctrl.prop = property;
    	console.log(ctrl.prop);
    	$('#propModel').modal('show');
    }
    ctrl.selectedArr = [];
    ctrl.selectedProperty = {};
    ctrl.propValue = function (property, prp) {
    	ctrl.selectedProperty = property;
    	prp.selectedValue = property.value;
    	prp.selectedPropertyId = property.id;
    	if (ctrl.selectedArr.indexOf(prp.id.toString()) !== -1) {
              ctrl.selectedArr.push(prp.id);
        }
        ctrl.checkSelectedProperties();
    	 
    	$('#propModel').modal('hide');
    }

	$scope.onItemRating = function (rating) {
		$scope.rating = rating;
	  };
	  
	  ctrl.isTitle = "";
	  ctrl.isComment ="";
	  ctrl.isRating = "";
	ctrl.addReview = function (cmtTittle, comment) {
		console.log(cmtTittle);
		console.log(comment);
		console.log($scope.rating);
		var review = {};
		review.comment = comment;
		review.subject = cmtTittle;
		review.rating = $scope.rating;
		review.productId = $stateParams.productId;
		if(angular.isUndefined(cmtTittle) || cmtTittle == "" || angular.isUndefined(comment)|| comment == ""|| angular.isUndefined($scope.rating)|| $scope.rating == "") {
			ctrl.isTitle = "*Please add title";
			ctrl.isComment ="*Please add comment";
			ctrl.isRating = "*Please give rating";
		} else {
			var s = new Date().getTime();	
			Store.saveReview(review)
			.then(function (response) {
			var e = new Date().getTime();
            var t = e-s;
            Store.awsCloudWatch('JS Web Save review','JS Web save-review',t);	
			ctrl.product.reviews = response.data.reviews;
			console.log(ctrl.product);
			$scope.rating = 0;
			$scope.comment = '';
			$scope.cmtTittle = '';
			ctrl.isTitle = "";
			ctrl.isComment ="";
			ctrl.isRating = "";
			ctrl.getProductReviews();
			$('#modalClose').click();
			})
			.catch(function (response) {
			$log.log(response);
			});
		}
  
	  };

	  ctrl.getProductReviews = function () {
		  var productParam = { productId: $stateParams.productId };
		  BusyLoader.show();
		  var s = new Date().getTime();
		  Store.getProductReviews(productParam)
		  .then(function (response) {
		  	var e = new Date().getTime();
            var t = e-s;
            Store.awsCloudWatch('JS Web Get product reviews','JS Web get-product-reviews',t);
			$log.log(response.data);
			ctrl.product.reviews = response.data.reviews;
		  })
		  .catch(function (response) {
			$log.log(response);
		  })
		  .finally(function () {
			BusyLoader.hide();
		  });
	  };
	  //initSlider();
});
