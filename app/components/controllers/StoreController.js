app.controller('StoreController', function($scope) {
    console.log("Hi in store controller");
    document.getElementById("body").classList.remove('authenticate');
    document.getElementById("body").classList.remove('landing');
    $scope.openNav = function() {
        console.log('Here');
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
    }

    $scope.closeNav = function() {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft= "0";
    }

});