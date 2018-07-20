'use strict';
angular.module('store')
.controller('EditAddressCtrl', function ($rootScope, $scope, $log, $ionicModal, $ionicPopover, Store, $state, $stateParams) {

    $log.log('Hello from your Controller: EditAddressCtrl in module store:. This is your controller:', this);
    var ctrl = this;
    ctrl.addressDTO = {
        isResidential: false,
        status: false,
    };

    ctrl.addressDTO = JSON.parse($stateParams.address);
    ctrl.addressDTO.phone = Number(ctrl.addressDTO.phone);
    ctrl.addressDTO.zipCode = Number(ctrl.addressDTO.zipCode);
    if(ctrl.addressDTO.status == 1) {
        ctrl.isDefaultAddress = true;
    }
    if(ctrl.addressDTO.status == 2) {
        ctrl.isDefaultAddress = false;
    }
    if(ctrl.addressDTO.isResidential == null) {
        ctrl.addressDTO.isResidential = false;
    }
    ctrl.saveAddress = function () {
        $log.log(ctrl.addressDTO);
        console.log(ctrl.addressDTO);
        ctrl.addressDTO.status = ctrl.isDefaultAddress ? 1 : 2;
        var s = new Date().getTime();
        Store.saveAddress(ctrl.addressDTO)
        .then(function (response) {
            var e = new Date().getTime();
          var t = e-s;
          Store.awsCloudWatch('JS Web Save address','JS Web save-address',t);
            $state.go('store.myaddress');
        })
        .catch(function (error) {
            $log.log(error);
        });
    };
    
    ctrl.goBack = function() {
        $state.go('store.myaddress');        
    }

    ctrl.setResidentialAddress = function(flag) {
        console.log("...........",flag,ctrl.addressDTO.isResidential);
        ctrl.addressDTO.isResidential = flag;
    }
    ctrl.setDefaultAddressFlag = function(flag) {
        console.log("...........",flag,ctrl.isDefaultAddress);
        ctrl.isDefaultAddress = flag;
    }
});