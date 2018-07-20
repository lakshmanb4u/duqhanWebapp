'use strict';
angular.module('store')
.controller('AddAddressCtrl', function ($rootScope, $scope, $log, $ionicModal, $ionicPopover, Store, $state) {

    $log.log('Hello from your Controller: AddAddressCtrl in module store:. This is your controller:', this);
    var ctrl = this;
    ctrl.addressDTO = {
        isResidential: false,
        status: false,
    };

    ctrl.saveAddress = function () {
        $log.log(ctrl.addressDTO);
        if(ctrl.addressDTO.isResidential == null || angular.isUndefined(ctrl.addressDTO.isResidential)) {
            ctrl.addressDTO.isResidential = false;
        }
        ctrl.addressDTO.status = ctrl.addressDTO.status ? 1 : 2;
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

    ctrl.init = function (){
        if($state.includes('store.editaddress')){
            ctrl.addressDTO = $rootScope.addressDTO;
            if(ctrl.addressDTO.phone != undefined && ctrl.addressDTO.phone != null){
                ctrl.addressDTO.phone = Number( ctrl.addressDTO.phone )
            }
            if(ctrl.addressDTO.zipCode != undefined && ctrl.addressDTO.zipCode != null){
                ctrl.addressDTO.zipCode = Number( ctrl.addressDTO.zipCode )
            }
        }
        $rootScope.addressDTO = null;
    }

    ctrl.init();
});