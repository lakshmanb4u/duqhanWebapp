'use strict';
angular.module('auth')
  .controller('ContactusPublicCtrl', function ($log, $rootScope, $localStorage, Store) {

    $log.log('Hello from your Controller: ContactusPublicCtrl in module auth:. This is your controller:', this);

    var ctrl = this;

    ctrl.countList = [
      { id: 1, name: 'Order' },
      { id: 2, name: 'Cancellations and Returns' },
      { id: 3, name: 'Payment' },
      { id: 3, name: 'Shopping' },
      { id: 3, name: 'Others' }
    ];
    ctrl.Subjects = ctrl.countList[0].id;

    ctrl.ContactPublicForm = {
      submitted: false
    };
    ctrl.Contact = {
      statusCode: '',
      status: '',
      name: '',
      email: '',
      mobile: ''
    };

    ctrl.ContactUs = function () {
      ctrl.ContactPublicForm.submitted = true;
      if (ctrl.ContactPublicForm.$valid) {
        ctrl.Contact.statusCode = ctrl.statusCode;
        Store.contactUsPublic(ctrl.Contact)
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
            ctrl.ContactPublicForm.submitted = false;
          })
          .catch(function (response) {
            $log.log(response);
          });
      }
    };

  });
