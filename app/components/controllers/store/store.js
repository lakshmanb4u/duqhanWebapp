'use strict';
angular
  .module('store', [
    'ionic',
    'ngCordova',
    'ui.router',
    'ionic-datepicker',
    'ionic.ion.imageCacheFactory',
    'angularMoment',
    'ionic.closePopup',
	'ksSwiper',
	'infinite-scroll',
	'ui.bootstrap',
	'720kb.datepicker',
	'autoCompleteModule'
    // TODO: load other modules selected during generation
  ])

  .config(function ($stateProvider, $ionicConfigProvider) {
    // $ionicConfigProvider.tabs.style('striped');
    $ionicConfigProvider.tabs.position('top');
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);

  //   // ROUTING with ui.router
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html
      .state('store', {
            url : '',
            templateUrl: 'components/views/home.html',
            controller: 'StoreMenuCtrl as menu'
        })
	/*.state('store', {
		url: '/store',
		templateUrl: 'components/views/store.html',
		controller: 'StoreMenuCtrl as menu'
	})*/
	.state('store.profile', {
		url: '/profile',
		templateUrl: 'components/views/profile.html',
		controller: 'ProfileCtrl as ctrl'
	})
	.state('store.products', {
		url: '/products',
		templateUrl: 'components/views/latest.html',
		controller: 'ProductsCtrl as ctrl'
	})
	.state('store.products.latest', {
		url: '/latest',
		templateUrl: 'components/views/latest.html',
		controller: 'ProductsCtrl as ctrl'
	})
	.state('store.productsByCategory', {
		url: '/products-by-category?categoryId&otherCategory',
		templateUrl: 'components/views/products-by-category.html',
		controller: 'ProductsByCategoryCtrl as ctrl'
	})
	.state('store.productsSearch', {
		url: '/products-search/:searchText',
		// cache: false,
		templateUrl: 'components/views/products-by-search.html',
		controller: 'SearchCtrl as ctrl'
	})
	.state('store.searchNotFound', {
		url: '/search-not-found/:searchText',
		templateUrl: 'components/views/search-not-found.html',
		controller: 'SearchCtrl as ctrl'
	})
	/*.state('store.product', {
		url: '/product/:productId',
		abstract: true,
		cache: false,
		//templateUrl: 'components/views/product.html'
		//controller: 'ProductCtrl as ctrl'
	})*/
	.state('store.overview', {
		url: '/product/:productId/overview',
		templateUrl: 'components/views/overview.html',
		controller: 'ProductCtrl as ctrl'
	})
	.state('store.aboutus', {
		url: '/aboutus',
		templateUrl: 'components/views/about.html',
		controller: 'AboutCtrl as ctrl'
	})
	.state('store.myaddress', {
		url: '/my-address',
		templateUrl: 'components/views/my-address.html',
		controller: 'AddressCtrl as ctrl'
	})
	.state('store.addnewaddress', {
		url: '/add-new-address',
		templateUrl: 'components/views/add-address.html',
		controller: 'AddAddressCtrl as ctrl'
	})
	.state('store.editaddress', {
		url: '/edit-address?:address',
		params: {
			address: null
		},
	   templateUrl: 'components/views/edit-address.html',
	   controller: 'EditAddressCtrl as ctrl'
	})
	.state('store.mycart', {
		url: '/my-cart',
		templateUrl: 'components/views/my_cart.html',
		controller: 'CartCtrl as ctrl'
	})
	.state('store.emptycart', {
		url: '/empty-cart',
		templateUrl: 'components/views/cart_empty.html',
		controller: 'CartCtrl as ctrl'
	})
	.state('store.customersupport', {
		url: '/customer-support',
		templateUrl: 'components/views/customer_support.html',
		controller: 'CustomerSupportCtrl as ctrl'
	})
	.state('store.customerSupportQuestions', {
		url: '/customer-support-questions',
		templateUrl: 'components/views/ask-question.html',
		controller: 'askQuestionCtrl as ctrl'
	})
	.state('store.paymentIssue', {
		url: '/payment-issue',
		templateUrl: 'components/views/payment_issue.html',
	})
	.state('store.ShippingDelivery', {
		url: '/ShippingDelivery',
		templateUrl: 'components/views/ShippingDelivery.html',
	})
	.state('store.ReturnRefunds', {
		url: '/ReturnRefunds',
		templateUrl: 'components/views/ReturnRefunds.html',
	})
	.state('store.PaymentPricingPromotions', {
		url: '/PaymentPricingPromotions',
		templateUrl: 'components/views/PaymentPricingPromotions.html',
	})
	.state('store.OrdersQuestion', {
		url: '/OrdersQuestion',
		templateUrl: 'components/views/OrdersQuestion.html',
	})
	.state('store.ManagingAccount', {
		url: '/ManagingAccount',
		templateUrl: 'components/views/ManagingAccount.html',
	})
	.state('store.orderhistory', {
		url: '/order-history',
		templateUrl: 'components/views/order-history.html',
		controller: 'OrderHistoryCtrl as ctrl'
	})
	.state('store.checkout', {
	 	url: '/checkout',
		templateUrl: 'components/views/checkout.html',
		controller: 'CheckoutCtrl as ctrl'
	})
	.state('store.guest-landing', {
        url: "/guest-landing/:productId",
        templateUrl: 'components/views/guest-landing.html',
        controller: 'GuestUserCtrl as ctrl' 
    })
    .state('store.guest-login', {
        url: "/guest-login",
        templateUrl: 'components/views/guest-login.html',
        controller: 'GuestUserCtrl as ctrl' 
    })
    .state('store.guest-register', {
        url: '/guest-register',
        templateUrl: 'components/views/guest-register.html',
        controller: 'GuestSignupCtrl as ctrl'
    })
    /*.state('store.guest-forgot-password', {
        url: '/guest-forgot-password',
        templateUrl: 'components/views/forgot-password.html',
        controller: 'GuestForgotPasswordCtrl as ctrl'
    })
    .state('store.guest-change-password', {
        url: '/guest-change-password/:email',
        params: {
            email: null
       },
        templateUrl: 'components/views/change-password.html',
        controller: 'GuestForgotPasswordCtrl as ctrl'
    })
    */
	.state('store.contactus', {
			url: '/contactus',
			templateUrl: 'components/views/contactus.html',
			controller: 'ContactusCtrl as ctrl'
	}) 
	.state('store.orderdetails', {
		url: '/order-details?:order',
		params: {
				 	order: null
				},
			templateUrl: 'components/views/order-details.html',
			controller: 'OrderDetailsCtrl as ctrl'
	})
	.state('store.returnOrder', {
		url: '/return-order?:order',
		params: {
			order: null
		},
			templateUrl: 'components/views/return-order.html',
			controller: 'ReturnOrderCtrl as ctrl'
	})			 
	// .state('store.products.recent', {
	// 	url: '/recent',
	// 	// cache: false,
	// 	views: {
	// 		recentProductsContent: {
	// 		templateUrl: 'store/templates/products/products.html'

	// 		// controller: 'ProductsCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.productsSearch', {
	// 	url: '/products-search/:searchText',
	// 	// cache: false,
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/products/products-search.html',
	// 		controller: 'SearchCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.productsByCategory', {
	// 	url: '/products-by-category/:categoryId',
	// 	// cache: false,
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/products/products-by-category.html',
	// 		controller: 'ProductsByCategoryCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.categories', {
	// 	url: '/categories/:categoryId',
	// 	// cache: false,
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/products/categories.html',
	// 		controller: 'ProductsByCategoryCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.product', {
	// 	url: '/product/:productId',
	// 	abstract: true,
	// 	cache: false,
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/product/product-tab.html',
	// 		controller: 'ProductCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.product.overview', {
	// 	url: '/overview',
	// 	views: {
	// 		overviewProductContent: {
	// 		templateUrl: 'store/templates/product/overview.html'

	// 		// controller: 'ProductCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.product.related', {
	// 	url: '/related',
	// 	views: {
	// 		relatedProductContent: {
	// 		templateUrl: 'store/templates/product/related.html'

	// 		// controller: 'ProductCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.product.description', {
	// 	url: '/description',
	// 	views: {
	// 		descriptionProductContent: {
	// 		templateUrl: 'store/templates/product/description.html'

	// 		// controller: 'ProductCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.cart', {
	// 	url: '/cart',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/cart.html',
	// 		controller: 'CartCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.checkout', {
	// 	url: '/checkout',
	// 	params: {
	// 		cart: null
	// 	},
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/checkout.html',
	// 		controller: 'CheckoutCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.afterPayment', {
	// 	url: '/after-payment',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/after-payment.html',
	// 		controller: 'AfterPaymentCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.profile', {
	// 	url: '/profile',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/profile.html',
	// 		controller: 'ProfileCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.changepassword', {
	// 	url: '/change-password',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/change-password.html'

	// 		// controller: '<someCtrl> as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.myaddress', {
	// 	url: '/my-address',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/my-address.html',
	// 		controller: 'AddressCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.orderdetails', {
	// 	url: '/order-details',
	// 	params: {
	// 		order: null
	// 	},
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/order-details.html',
	// 		controller: 'OrderHistoryCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.customersupport', {
	// 	url: '/customer-support/:p',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/customer-support.html',
	// 		controller: 'CustomerSupportCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.sizes', {
	// 	url: '/sizes',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/size-chart.html',
	// 		controller: 'SizeChartCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.shipping', {
	// 	url: '/shipping',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/shipping.html',
	// 		controller: 'ShippingCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.returnpolicy', {
	// 	url: '/return-policy',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/return-policy.html',
	// 		controller: 'ReturnPolicyCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.aboutus', {
	// 	url: '/aboutus',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/misc/about.html',
	// 		controller: 'AboutCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.contactus', {
	// 	url: '/contactus',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/contactus.html',
	// 		controller: 'ContactusCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.privacyPolicy', {
	// 	url: '/privacy-policy',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/misc/privacy-policy.html',
	// 		controller: 'PrivacyPolicyCtrl as ctrl'
	// 		}
	// 	}
	// })
	// .state('store.termsConditions', {
	// 	url: '/terms-conditions',
	// 	views: {
	// 		storeContent: {
	// 		templateUrl: 'store/templates/misc/terms-conditions.html',
	// 		controller: 'TermsConditionsCtrl as ctrl'
	// 		}
	// 	}
	// });
});
