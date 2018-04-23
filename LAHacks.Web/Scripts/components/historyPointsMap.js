(function () {
    'use strict';
    angular.module(appName).component("historyPointsMap", {
        bindings: {
            lat: "<",
            long: "<"
        },
        templateUrl: "/Scripts/components/views/historyPointsMap.html",
        controller: function (geocodeService, $scope, foursquareService, $compile) {
            var vm = this;
            vm.$onInit = _init;
            vm.mapOptions = {
                center: null,
                zoom: 13
            };
            var infoWindow;
            vm.$onChanges = function (changes) {
                console.log("CHANGES", changes);
                var lat = changes.lat;
                var long = changes.long;
                if (!(lat.currentValue) && !(long.currentValue)) {
                    _init();
                    lat.currentValue = vm.lat;
                    long.currentValue = vm.long;
                    console.log("LAT CURRENT VAL: ", lat.currentValue);
                }
                if ((lat.previousValue != lat.currentValue) || (long.previousValue != long.currentValue)) {
                    console.log("LAT OBJ: " + JSON.stringify(lat) + "; LONG OBJ: " + JSON.stringify(long));
                    _search(lat.currentValue, long.currentValue);
                }
            }

            function _init() {
                console.log("LAT AND LONG IN INIT: " + JSON.stringify(vm.lat) + ", " + JSON.stringify(vm.long));
                initMap();
            }

            function initMap() {
                infoWindow = new google.maps.InfoWindow;

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        _search(position.coords.latitude, position.coords.longitude);
                    }, function () {
                        handleLocationError(true, infoWindow, map.getCenter());
                    });
                } else {
                    handleLocationError(false, infoWindow, map.getCenter());
                }
            }

            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                    'Error: The Geolocation service failed.' :
                    'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(map);
            }

            function _search(lat, long) {
                console.log("LAT AND LONG IN SEARCH FUNC: " + JSON.stringify(lat) + ", " + JSON.stringify(long));
                if (lat !== undefined && long !== undefined) {
                    vm.mapOptions.center = new google.maps.LatLng(lat, long);
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
                        position: new google.maps.LatLng(lat, long),
                        icon: myCurrentPlaceIcon,
                        title: "I'm Here"
                    });

                    var latlong = lat + "," + long;
                    foursquareService.getVenuesByHistoricCategory(latlong)
                        .then(function () {
                            const venues = JSON.parse(localStorage.getItem("venues"));

                            for (const obj of venues) {
                                if (obj.venue.photos.groups[0]) {
                                    let contentString = `<div id='content'>
                                    <h4 class="text-center">${obj.venue.name}</h4>
                                    <div><img src=${obj.venue.photos.groups[0].items[0].prefix}100x100${obj.venue.photos.groups[0].items[0].suffix} /><br/>`;

                                    if (obj.tips) {
                                        contentString += `<div>${obj.tips[0].text}</div>`;
                                    }

                                    contentString += `</div><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(obj.venue.name)}" target="_blank"> 
                                    https://en.wikipedia.org/wiki/${obj.venue.name}</a></div > `;

                                    let infowindow = new google.maps.InfoWindow({
                                        content: contentString
                                    });
                                }

                                let marker = new google.maps.Marker({
                                    map: vm.map,
                                    position: new google.maps.LatLng(obj.venue.location.lat, obj.venue.location.lng),
                                    icon: venueIcon,
                                    title: obj.venue.name
                                });

                                marker.addListener('click', function () {
                                    infowindow.open(vm.map, marker);
                                });
                            }
                            google.maps.event.trigger(vm.map, 'resize');
                            console.log("END OF SEARCH");
                        });
                }
            }

        }
    });
})();