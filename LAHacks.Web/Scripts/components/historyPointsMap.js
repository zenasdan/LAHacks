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
                    //_googleMapResizeBugFix(lat.currentValue, long.currentValue);
                }
            }

            //var map, infoWindow;
            //function initMap() {
            //    map = new google.maps.Map(document.getElementById('map'), {
            //        center: { lat: -34.397, lng: 150.644 },
            //        zoom: 6
            //    });
            //    infoWindow = new google.maps.InfoWindow;

            //    // Try HTML5 geolocation.
            //    if (navigator.geolocation) {
            //        navigator.geolocation.getCurrentPosition(function (position) {
            //            var pos = {
            //                lat: position.coords.latitude,
            //                lng: position.coords.longitude
            //            };

            //            infoWindow.setPosition(pos);
            //            infoWindow.setContent('Location found.');
            //            infoWindow.open(map);
            //            map.setCenter(pos);
            //        }, function () {
            //            handleLocationError(true, infoWindow, map.getCenter());
            //        });
            //    } else {
            //        // Browser doesn't support Geolocation
            //        handleLocationError(false, infoWindow, map.getCenter());
            //    }
            //}

            //function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            //    infoWindow.setPosition(pos);
            //    infoWindow.setContent(browserHasGeolocation ?
            //        'Error: The Geolocation service failed.' :
            //        'Error: Your browser doesn\'t support geolocation.');
            //    infoWindow.open(map);
            //}

            function _init() {
                console.log("LAT AND LONG IN INIT: " + JSON.stringify(vm.lat) + ", " + JSON.stringify(vm.long));
                vm.lat = 34.0705;
                vm.long = -118.4468;
                _search(vm.lat, vm.long);
            }

            function _search(lat, long) {
                console.log("LAT AND LONG IN SEARCH FUNC: " + JSON.stringify(lat) + ", " + JSON.stringify(long));
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

                foursquareService.getVenuesByHistoricCategory();
                const venues = JSON.parse(localStorage.getItem("venues"));

                for (const obj of venues) {
                   
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

                    let marker = new google.maps.Marker({
                        map: vm.map,
                        position: new google.maps.LatLng(obj.venue.location.lat, obj.venue.location.lng),
                        //icon: `${obj.venue.categories[0].icon.prefix}32${obj.venue.categories[0].icon.suffix}|ddd`,
                        //icon: {
                        //    url: `${obj.venue.categories[0].icon.prefix}32${obj.venue.categories[0].icon.suffix}`,
                        //    strokeColor: 'blue',
                        //    scale: 3,
                        //    fillColor: '#0ff',
                        //    fillOpacity: 1,
                        //},
                        icon: venueIcon,
                        title: obj.venue.name
                    });

                    marker.addListener('click', function () {
                        infowindow.open(vm.map, marker);
                    });
                }
                google.maps.event.trigger(vm.map, 'resize');
                console.log("END OF SEARCH");
            }

            //function _googleMapResizeBugFix(lat, long) {
                
            //    google.maps.event.addListenerOnce(vm.map, 'idle', function () {
            //        _search(lat, long);
            //        google.maps.event.trigger(vm.map, 'resize');
            //    });
            //    console.log("RESIZING FINISHED");
            //}

        }
    });
})();