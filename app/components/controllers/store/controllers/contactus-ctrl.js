'use strict';
angular
  .module('store')
  .controller('ContactusCtrl', function ($log, $rootScope, $localStorage, Store, $window) {
    $log.log(
      'Hello from your Controller: ContactusCtrl in module store:. This is your controller:',
      this
    );

    var ctrl = this;
    $window.scrollTo(0, 0);
    ctrl.countList = [
      { id: 1, name: 'Order' },
      { id: 2, name: 'Cancellations and Returns' },
      { id: 3, name: 'Payment' },
      { id: 3, name: 'Shopping' },
      { id: 3, name: 'Others' }
    ];
    ctrl.Subjects = ctrl.countList[0].id;

    var savedUser = $localStorage.savedUser;
    var parsedUser = JSON.parse(savedUser);
    $log.log(parsedUser);

   
    ctrl.UserForm = {
      submitted: false
    };
    ctrl.user = {
      statusCode: '',
      status: '',
      email: parsedUser.email,
      mobile: parsedUser.mobile
    };
ctrl.notificationText = "";
    ctrl.ContactUs = function () {
      ctrl.UserForm.submitted = true;
      var s = new Date().getTime();
        Store.contactUs(ctrl.user)
          .then(function (response) {
            var e = new Date().getTime();
            var t = e-s;
            Store.awsCloudWatch('JS Web Contact us','JS Web contact-us',t);
            $log.log(response);
            var notification = {};
            notification.type = 'success';
            notification.text =
              'We have received your message. We will get back to you with 7 working days.';
              ctrl.notificationText = "We have received your message. We will get back to you with 7 working days.";
            $rootScope.$emit('setNotification', notification);
            ctrl.user = {
              statusCode: '',
              status: ''
            };
            ctrl.UserForm.submitted = false;
          })
          .catch(function (response) {
            $log.log(response);
            ctrl.notificationText = "";
          });
    };

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
  });
