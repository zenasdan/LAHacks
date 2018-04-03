(function () {
    'use strict';

    angular.module(appName).component("locationSearch", {
        bindings: {
            lat: "=",
            long: "="
        },
        templateUrl: "/scripts/components/views/locationSearch.html",
        controller: function ($scope, requestService) {
            var vm = this;
            vm.$onInit = _init;
            vm.search = _search;
            vm.lat = {};
            vm.long = {};

            function _init() {
            }

            function _search(searchText) {
                var result = _concatify(searchText);
                var model = {"queryString": result};
                requestService.ApiRequestService("POST", "/api/places", model)
                    .then(function (response) {
                        console.log("SUCCESS SEARCH ", response);
                        var results = response.results;
                        if (results.length > 0) {
                            vm.lat = results[0].geometry.location.lat;
                            vm.long = results[0].geometry.location.lng;
                        }
                    })
                    .catch(function (err) {
                        console.log("FAILED SEARCH ", err);
                    });
            }

            function _concatify(str) {
                var temp = str.split(" ");
                return temp.join("+");
            }

            function _getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }
        }
    })
})();