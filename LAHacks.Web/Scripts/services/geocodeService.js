(function () {
    'use strict';
    angular.module(appName).factory("geocodeService", GeocodeService);

    function GeocodeService() {
        var srv = {
            Geocode: _geocode
        };
        return srv;
        //function expects a street address, city, and zipcode
        function _geocode(streetAddress, city, zipcode) {
            //creates a new instance of Geocoder
            var geocoder = new google.maps.Geocoder();
            //combining the parameters into one large string
            var address = streetAddress + ", " + city + ", " + zipcode;
            //createing a new promise
            return new Promise(function (resolve, reject) {
                //passing an object with a key address
                geocoder.geocode({ 'address': address }, function (results, status) {
                    if (status === 'OK') {
                        console.log(results);
                        //puts the values into an object
                        var latLong = {
                            latitude: results[0].geometry.location.lat(),
                            longitude: results[0].geometry.location.lng()
                        };
                        resolve(latLong);
                        return latLong;
                        console.log(latLong);
                    } else {
                        reject(new Error('Geocode was not successful for the following reason: ' + status));
                    }
                });
            })
        }
    }
})();