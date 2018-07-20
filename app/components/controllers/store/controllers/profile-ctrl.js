'use strict';
angular.module( 'store' )
  .controller( 'ProfileCtrl', function (
    $scope,
    $log,
    $ionicActionSheet,
    $rootScope,
    $filter,
    $localStorage,
    Store,
    $state,
    BusyLoader,
    $window,
    Config
  ) {

    /* Storing contextual this in a variable for easy access */

    var ctrl = this;

    $log.log( 'Hello from your Controller: ProfileCtrl in module store:. This is your controller:', this );


    /*============================================
    =            Prefill profile form            =
    ============================================*/
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
    ctrl.user = {};
    ctrl.countryCode = {};
    ctrl.getProfileDetails = function () {
      var savedUser = $localStorage.savedUser;
      var parsedUser = JSON.parse( savedUser );
      var s = new Date().getTime();
      Store.getProfileDetails()
        .then( function ( response ) {
          var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Get profile details','JS Web get-profile-details',t);
          $log.log( response );
          ctrl.user = response.data;
          if ( !response.data.mobile ) {
            ctrl.user.mobile = undefined;
          } else {
            ctrl.user.mobile = Number( response.data.mobile );
          }
          if ( parsedUser.socialLogin ) {
            ctrl.user.socialLogin = true;
            if ( !response.data.profileImg ) {
              ctrl.user.profileImg = Config.ENV.USER.PROFILE_IMG;
            }
          }
          ctrl.user.dob = new Date(ctrl.user.dob);
          $log.log( ctrl.user );
        } )
        .catch( function ( response ) {
          $log.log( response );
        } );
    };

    ctrl.getCountryCode = function () {
      Store.getCountryCode()
        .then( function ( response ) {
          $log.log( response );
          ctrl.countryCode = response.data.currencyCodes;
          console.log(ctrl.countryCode);
          $log.log( ctrl.user );
        } )
        .catch( function ( response ) {
          $log.log( response );
        } );
    };

    ctrl.user.image = 'store/assets/images/user.png';

    //ctrl.getProfileDetails();

    /*----------  call the function when user is in profile page  ----------*/

    $rootScope.$on( '$stateChangeSuccess', function ( event, toState ) {
      $log.log('Here is state', toState);
      if ( toState.name === 'store.profile' ) {        
        ctrl.getProfileDetails();
        ctrl.getCountryCode();
      }
    } );
    
    ctrl.getProfile = function() {
      if($state.includes('store.profile')){
        ctrl.getProfileDetails();  
        ctrl.getCountryCode();      
      }
    };

    ctrl.getProfile();
    

    /*=====  End of Prefill profile form  ======*/


    /*============================================
    =            Profile image upload            =
    ============================================*/

    /*----------  Open image source selector Action Sheet   ----------*/

    ctrl.openImageSourceSelector = function () {
      // $log.log( ionic.Platform.device() );
      // ImageUpload.getImageSource()
      //   .then( function ( source ) {
      //     $log.log( source );
      //     return ImageUpload.getPicture( source );
      //   } )
      //   .then( function ( url ) {
      //     BusyLoader.show();
      //     return Store.updateProfileImage( url, ctrl.user.id );
      //   } )
      //   // .then(function (cloudinaryUrl) {
      //   //   $log.log(cloudinaryUrl);
      //   //   ctrl.user.profileImg = cloudinaryUrl;
      //   //   var userBean = {};
      //   //   userBean.profileImg = cloudinaryUrl;
      //   //   return Store.updateProfileImage(userBean);
      //   // })
      //   .then( function ( data ) {
      //     $log.log( data );
      //     var res = JSON.parse( data.response );
      //     $log.log( res );
      //     ctrl.user.profileImg = res.profileImg;
      //     Config.ENV.USER.PROFILE_IMG = ctrl.user.profileImg;
      //     $rootScope.$emit( 'setUserDetailForMenu' );
      //     BusyLoader.hide();
      //   } )
      //   .catch( function ( response ) {
      //     $log.log( response );
      //     BusyLoader.hide();
      //   } );
    };

    /*=====  End of Profile image upload  ======*/

    /*==============================================
    =            Update profile details            =
    ==============================================*/

  
    ctrl.showMessage = "";
    ctrl.updateProfileDetails = function () {
      $log.log('In update', ctrl.user );
        ctrl.user.dob = $filter( 'date' )( new Date( ctrl.user.dob ), 'dd/MM/yyyy' );
        var s = new Date().getTime();
        Store.updateProfileDetails( ctrl.user )
          .then( function ( response ) {
            var e = new Date().getTime();
            var t = e-s;
            Store.awsCloudWatch('JS Web Update profile details','JS Web update-profile-details',t);
            $log.log( response );
            ctrl.user = response.data;
            ctrl.user.mobile = Number( response.data.mobile );
            Config.ENV.USER.NAME = response.data.name;
            Config.ENV.USER.PROFILE_IMG = response.data.profileImg;
            ctrl.showMessage = "Profile updated successfully";
            $rootScope.$emit( 'setUserDetailForMenu' );
            var notification = {};
            notification.type = 'success';
            notification.text = 'Profile updated successfully';
            $rootScope.$emit( 'setNotification', notification );
          } )
          .catch( function ( response ) {
            $log.log( response );
            ctrl.showMessage = "";
          } );
    };

    ctrl.uploadImage = function () {
      console.log('in uploadImage')
      var file = $("#upload_file")[0].files[0];
      console.log('file', file);
      var data = new FormData();
      data.append('file', file);
      $('#loaderImg').show();
      $('#body').fadeTo(0, 0.4);
      $window.scrollTo(0, 0);
      $('#body').css("overflow", "hidden");
      $('#body').css("pointer-events", "none");
      var success = function(data){
        Config.ENV.USER.PROFILE_IMG = data.profileImg;
        ctrl.user.profileImg = data.profileImg;
        $('#loaderImg').hide();
        $('#body').fadeTo(0, 1);
        $('#body').css("overflow", "scroll");
        $('#body').css("pointer-events", "all");
        $scope.$apply();
        $rootScope.$emit( 'setUserDetailForMenu' );
         var notification = {};
            notification.type = 'success';
            notification.text = 'Profile updated successfully';
            $rootScope.$emit( 'setNotification', notification );
      }
      var error = function(err){
        $log.log(err);
        $('#loaderImg').hide();
        $('#body').fadeTo(0, 1);
        $('#body').css("overflow", "scroll");
        $('#body').css("pointer-events", "all");
      }
      Store.uploadImage(ctrl.user.id, data, success, error)
    };
    $("#upload_file").change(ctrl.uploadImage);
    /*=====  End of Update profile details  ======*/

    /*=======================================
    =            ionic-datepicker            =
    =======================================*/

    var options = {
      callback: function ( val ) {
        ctrl.user.dob = val;
      },
      from: new Date( 1917, 1, 1 ),
      to: new Date(),
      // inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: true,
      disableWeekdays: [ 0 ],
      closeOnSelect: false,
      dateFormat: 'dd MM yyyy',
      templateType: 'popup'
    };

    ctrl.openDatePicker = function () {
      //ionicDatePicker.openDatePicker( options );
    };

    /*=====  End of ionic-datepicker  ======*/
    ctrl.popup2 = {
      opened: false
    };
    
    ctrl.dt = new Date();
    ctrl.open2 = function() {
      ctrl.popup2.opened = true;
    };
  


  
    function disabled(data) {
      var date = data.date,
      mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    ctrl.dateOptions = {
      dateDisabled: disabled,
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };
    ctrl.altInputFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'M!/d!/yyyy']


  } );
