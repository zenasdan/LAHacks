(function () {
    'use strict';

    angular.module(appName).component("registrationOrSignInModalComponent", {
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        templateUrl: "/scripts/components/views/registrationOrSignInModal.html",
        controller: function ($scope, $timeout) {
            var vm = this;
            vm.$onInit = _init;
            vm.closeMod = _closeMod;
            vm.signUp = _signUp;
            vm.signIn = _signIn;
            vm.state = 'signin';
            vm.createAccount = _createAccount;

            function _init() {
                console.log("registration or sign in modal firing");
            }

            function _closeMod() {
                vm.close();
            }

            function _createAccount() {
                vm.state = 'signup';
            }

            function _signUp(model, form) {
                firebase.auth().createUserWithEmailAndPassword(model.email, model.password)
                    .then(function (success) {
                        _clearFields(form);
                        _onAuthStateChanged();
                    })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        $scope.showError = true;
                        if (errorCode == 'auth/weak-password') {
                            vm.error = 'The password is too weak.';
                        } else {
                            console.log("errorMessage", errorMessage);
                            vm.error = errorMessage;
                        }
                    });
            }

            function _signIn(model, form) {
                var user = firebase.auth().currentUser;
                if (user) {
                    _signOut();
                    _emailAndPassAuth(model, form, user);
                } else {
                    _emailAndPassAuth(model, form, user);
                }
            }

            function _emailAndPassAuth(model, form, user) {
                firebase.auth().signInWithEmailAndPassword(model.email, model.password)
                    .then(function (success) {
                        _setCookie(user);
                        _clearFields(form);
                    })
                    .catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        $scope.showError = true;
                        if (errorCode === 'auth/wrong-password') {
                            vm.error = 'Wrong password.';
                        } else {
                            vm.error = errorMessage;
                        }
                    });
            }

            function _setCookie(user) {
                var exdays = 3;
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = "email=" + user.email + ";uid=" + user.uid + ";" + expires + ";path=/";
            }

            function _clearFields(form) {
                vm.signUpModel = {};
                form.$setPristine();
                form.$setUntouched();
                window.location = "\/";
            }

            function _signOut() {
                firebase.auth().signOut().then(function () {
                    document.cookie = "";
                }).catch(function (error) {
                });
            }
        }
    })
})();