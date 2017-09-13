'use strict';
angular
  .module('store')
  .controller('ContactusCtrl', function ($log, $rootScope, $localStorage, Store) {
    $log.log(
      'Hello from your Controller: ContactusCtrl in module store:. This is your controller:',
      this
    );

    var ctrl = this;

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

    ctrl.ContactForm = {
      submitted: false
    };
    ctrl.Contact = {
      statusCode: '',
      status: '',
      email: parsedUser.email,
      mobile: parsedUser.mobile
    };

    ctrl.ContactUs = function () {
      ctrl.ContactForm.submitted = true;
      if (ctrl.ContactForm.$valid) {
        ctrl.Contact.statusCode = ctrl.statusCode;
        Store.contactUs(ctrl.Contact)
          .then(function (response) {
            $log.log(response);
            var notification = {};
            notification.type = 'success';
            notification.text =
              'We have received your message. We will get back to you with 7 working days.';
            $rootScope.$emit('setNotification', notification);
            ctrl.Contact = {
              statusCode: '',
              status: ''
            };
            ctrl.ContactForm.submitted = false;
          })
          .catch(function (response) {
            $log.log(response);
          });
      }
    };
  });
