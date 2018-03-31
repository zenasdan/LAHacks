(function () {
    'use strict';
    angular.module(appName).component("historyPointsMap", {
        bindings: {},
        templateUrl: "/Scripts/components/views/historyPointsMap.html",
        controller: function (geocodeService, $scope, foursquareService) {
            var vm = this;
            vm.$onInit = _init;
            vm.mapOptions = {
                center: null,
                zoom: 12
            };

            function _init() {
                _search();
            }

            function _search() {
                vm.latitude = 34.0705;
                vm.longitude = -118.4468;
                vm.mapOptions.center = new google.maps.LatLng(vm.latitude, vm.longitude);

                vm.map = new google.maps.Map(document.getElementById('gmap'), vm.mapOptions);
                var centerIcon = {
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", 
                    scaledSize: new google.maps.Size(40, 40), 
                };
                var venueIcon = {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new google.maps.Size(40, 40),
                };
                var marker = new google.maps.Marker({
                    map: vm.map,
                    position: new google.maps.LatLng(vm.latitude, vm.longitude),
                    icon: centerIcon,
                    title: "historyPointsMap"
                });
                
                var secondMarker = new google.maps.Marker({
                    map: vm.map,
                    position: new google.maps.LatLng(34.081570700404164, -118.41371297836304),
                    icon: venueIcon,
                    title:"testMap"
                });

                google.maps.event.trigger(vm.map, 'resize');

                foursquareService.getVenuesByHistoricCategory();
            }

        }
    });
})();