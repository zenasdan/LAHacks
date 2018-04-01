(function () {
    'use strict';

    angular.module(appName).component("locationSearch", {
        bindings: {},
        templateUrl: "/scripts/components/views/locationSearch.html",
        controller: function ($scope, $firebaseObject) {
            var vm = this;
            vm.$onInit = _init;
            vm.search = _search;
            var ref = new Firebase("https://lahacks-1522486232734.firebaseio.com/data");
            // download the data into a local object
            var syncObject = $firebaseObject(ref);
            // synchronize the object with a three-way data binding
            // click on `index.html` above to see it used in the DOM!
            syncObject.$bindTo($scope, "locations");

            function _init() {
                console.log("Firing");
                console.log($scope);
            }

            function _search() {
                ref.push($scope.locations.text);
            }
        }
    })
})();