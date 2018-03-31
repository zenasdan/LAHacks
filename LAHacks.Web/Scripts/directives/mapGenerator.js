(function () {
    var mapGenerator = function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                mapGenerator: "=",
                lat: "<",
                long: "<",
                maptitle: "<"
            },
            link: function (scope, element, attributes, ngModel) {
                $timeout(
                    function () {
                        //targets the element it is regerenced in
                        var target = document.getElementById(attributes.id);
                        //creates a map using the lat and long tags in the element
                        var tempMap = new google.maps.Map(target, { center: new google.maps.LatLng(scope.lat, scope.long), zoom: 17, fullscreenControl: false });
                        //places a marker on the map to help user know which building.
                        var tempMarker = new google.maps.Marker({
                            map: tempMap,
                            position: new google.maps.LatLng(scope.lat, scope.long),
                            title: scope.title
                        });
                    }
                )

            }
        };
    };

    angular.module(appName).directive("mapGenerator", mapGenerator);
})();