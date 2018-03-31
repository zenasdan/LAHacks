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
                var myCurrentPlaceIcon = {
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new google.maps.Size(40, 40),
                };
                var venueIcon = {
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new google.maps.Size(40, 40),
                };

                vm.map = new google.maps.Map(document.getElementById('gmap'), vm.mapOptions);
                var marker = new google.maps.Marker({
                    map: vm.map,
                    position: new google.maps.LatLng(vm.latitude, vm.longitude),
                    icon: myCurrentPlaceIcon,
                    title: "I'm Here"
                });

                foursquareService.getVenuesByHistoricCategory();
                const venues = JSON.parse(localStorage.getItem("venues"));

                for (const obj of venues) {
                    console.log(obj);
                    new google.maps.Marker({
                        map: vm.map,
                        position: new google.maps.LatLng(obj.venue.location.lat, obj.venue.location.lng),
                        //icon: `${obj.venue.categories[0].icon.prefix}32${obj.venue.categories[0].icon.suffix}`,
                        icon: venueIcon,
                        title: obj.venue.name
                    });
                }
                
                google.maps.event.trigger(vm.map, 'resize');

                
            }
        }
    });
})();