(function () {
    'use strict';

    angular.module(appName).component("registrationOrSignInModalComponent", {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: "/scripts/components/views/registrationOrSignInModal.html",
        controller: function ($scope) {
            var vm = this;
            vm.$onInit = _init;
            vm.closeMod = _closeMod;
            vm.signUp = _signUp;

            function _init() {
                console.log("state in modal: " + vm.resolve.item.state);
            }

            function _closeMod() {
                vm.close();
            }

            function _signUp(model) {
                console.log(model);
                firebase.auth().createUserWithEmailAndPassword(model.email, model.password)
                    .then(function (success) {
                        console.log("SignUp Success!");
                        _onAuthStateChanged();
                    })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        if (errorCode == 'auth/weak-password') {
                            alert('The password is too weak.');
                        } else {
                            alert(errorMessage);
                        }
                        console.log(error);
                });
            }

            function _onAuthStateChanged() {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        // User is signed in.
                        var displayName = user.displayName;
                        var email = user.email;
                        var emailVerified = user.emailVerified;
                        var photoURL = user.photoURL;
                        var isAnonymous = user.isAnonymous;
                        var uid = user.uid;
                        var providerData = user.providerData;
                        console.log("Continuing to be signed in");
                        vm.close();
                    } else {
                        // User is signed out.
                        vm.close();
                        console.log("User has been signed out");
                    }
                });
            }
        }
    })
})();