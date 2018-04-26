(function () {
    'use strict';
    angular.module(appName).component("historyPointsMap", {
        bindings: {
            lat: "<",
            long: "<",
            places: "="
        },
        templateUrl: "/Scripts/components/views/historyPointsMap.html",
        controller: function (geocodeService, $scope, foursquareService) {
            var vm = this;
            vm.$onInit = _init;
            vm.mapOptions = {
                center: null,
                zoom: 13
            };
            vm.places = [];
            var infoWindow;
            vm.$onChanges = function (changes) {
                var lat = changes.lat;
                var long = changes.long;
                if (!(lat.currentValue) && !(long.currentValue)) {
                    _init();
                    lat.currentValue = vm.lat;
                    long.currentValue = vm.long;
                }
                if ((lat.previousValue != lat.currentValue) || (long.previousValue != long.currentValue)) {
                    _search(lat.currentValue, long.currentValue);
                }
            }

            function _init() {
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
                    var infowindow;

                    var latlong = lat + "," + long;
                    foursquareService.getVenuesByHistoricCategory(latlong)
                        .then(function () {
                            vm.places = JSON.parse(localStorage.getItem("venues"));
                            let markerArray = [];
                            for (const obj of vm.places) {
                                if (obj.venue.photos.groups[0]) {
                                    let contentString = `<div id='content'>
                                    <h4 class="text-center">${obj.venue.name}</h4>
                                    <div><img src=${obj.venue.photos.groups[0].items[0].prefix}100x100${obj.venue.photos.groups[0].items[0].suffix} /><br/>`;

                                    if (obj.tips) {
                                        contentString += `<div>${obj.tips[0].text}</div>`;
                                    }

                                    contentString += `</div><a href="https://en.wikipedia.org/wiki/${encodeURIComponent(obj.venue.name)}" target="_blank"> 
                                    https://en.wikipedia.org/wiki/${obj.venue.name}</a></div > `;

                                    let marker = new google.maps.Marker({
                                        map: vm.map,
                                        position: new google.maps.LatLng(obj.venue.location.lat, obj.venue.location.lng),
                                        icon: venueIcon,
                                        title: obj.venue.name
                                    });

                                    markerArray.push(marker);

                                    marker.addListener('click', function () {
                                        if (infowindow) {
                                            infowindow.close();
                                        }
                                        infowindow = new google.maps.InfoWindow({
                                            content: contentString
                                        });
                                        infowindow.open(vm.map, marker);
                                    });

                                    obj.venue.photos.groups[0].items[0].url = obj.venue.photos.groups[0].items[0].prefix + '300x250' + obj.venue.photos.groups[0].items[0].suffix;
                                } else {
                                    var temp = { items: [{ url: '../Content/Images/NoImageFound.jpg' }] };
                                    obj.venue.photos.groups.push(temp);
                                }
                                
                            }
                            var bounds = new google.maps.LatLngBounds();
                            for (var i = 0; i < markerArray.length; i++) {
                                bounds.extend(markerArray[i].getPosition());
                            }

                            vm.map.fitBounds(bounds);

                            google.maps.event.trigger(vm.map, 'resize');
                        });
                }
            }

        }
    });
})();