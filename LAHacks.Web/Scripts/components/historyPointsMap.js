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
                    console.log(obj.venue.photos.groups[0].items[0].prefix);
                    console.log(obj.venue.photos.groups[0].items[0].suffix);

                   
                    let contentString = `<div id='content'>
                        <h3 class="text-center">${obj.venue.name}</h3>
                        <div><img src=${obj.venue.photos.groups[0].items[0].prefix}100x100${obj.venue.photos.groups[0].items[0].suffix} />`;

                    if(obj.tips) {
                        contentString += `<div>${obj.tips[0].text}</div>`;
                    }

                    contentString += `</div><a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194"> 
                        https://en.wikipedia.org/w/index.php?title=Uluru</a></div > `;

                    //var contentString = '<div id="content">' +
                    //    '<div id="siteNotice">' +
                    //    '</div>' +
                    //    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
                    //    '<div id="bodyContent">' +
                    //    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
                    //    'sandstone rock formation in the southern part of the ' +
                    //    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
                    //    'area. It has many springs, waterholes, ' +
                    //    'rock caves and ancient paintings. Uluru is listed as a World ' +
                    //    'Heritage Site.</p>' +
                    //    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
                    //    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
                    //    '(last visited June 22, 2009).</p>' +
                    //    '</div>' +
                    //    '</div>';
                    
                    let infowindow = new google.maps.InfoWindow({
                        content: contentString
                    });

                    let marker = new google.maps.Marker({
                        map: vm.map,
                        position: new google.maps.LatLng(obj.venue.location.lat, obj.venue.location.lng),
                        //icon: `${obj.venue.categories[0].icon.prefix}32${obj.venue.categories[0].icon.suffix}`,
                        icon: venueIcon,
                        title: obj.venue.name
                    });

                    marker.addListener('click', function () {
                        infowindow.open(vm.map, marker);
                    });
                }

                google.maps.event.trigger(vm.map, 'resize');


            }
        }
    });
})();