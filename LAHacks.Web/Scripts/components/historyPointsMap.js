(function () {
    'use strict';
    angular.module(appName).component("historyPointsMap", {
        bindings: {},
        templateUrl: "/Scripts/components/views/historyPointsMap.html",
        controller: function (geocodeService, $scope) {
            var vm = this;
            vm.$onInit = _init;
            vm.mapOptions = {
                center: null,
                zoom: 18
            };

            function _init() {
                _search();
            }

            function _search() {
                vm.latitude = 34.0705;
                vm.longitude = -118.4468; 
                vm.mapOptions.center = new google.maps.LatLng(vm.latitude, vm.longitude);

                vm.map = new google.maps.Map(document.getElementById('gmap'), vm.mapOptions);
                var marker = new google.maps.Marker({
                    map: vm.map,
                    position: new google.maps.LatLng(vm.latitude, vm.longitude),
                    title: "historyPointsMap"
                });
                google.maps.event.trigger(vm.map, 'resize');
            }
        }
    });
})();