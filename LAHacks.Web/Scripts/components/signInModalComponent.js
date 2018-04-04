(function () {
    'use strict';

    angular.module(appName).component("signInModalComponent", {
        bindings: {
            close: '&',
            dismiss: '&'
        },
        templateUrl: "/scripts/components/views/signInModal.html",
        controller: function ($scope, $timeout, $uibModal) {
            var vm = this;
            vm.$onInit = _init;
            vm.closeMod = _closeMod;
            vm.signUp = _signUp;
            vm.signIn = _signIn;
            vm.createAccount = _createAccount;

            function _init() {
                vm.signInState = true;
            }

            function _closeMod() {
                vm.close();
            }

            function _createAccount() {
                vm.signInState = false;
            }

            function _signUp(model, form) {
                firebase.auth().createuserwithemailandpassword(model.email, model.password)
                    .then(function (success) {
                        _clearfields(form);
                    })
                    .catch(function (error) {
                        // handle errors here.
                        var errorcode = error.code;
                        var errormessage = error.message;
                        $scope.showerror = true;
                        if (errorcode == 'auth/weak-password') {
                            vm.error = 'the password is too weak.';
                        } else {
                            console.log("errormessage", errormessage);
                            vm.error = errormessage;
                        }
                    });
            }

            function _signIn(model, form) {
                var user = firebase.auth().currentUser;
                if (user) {
                    _signOut();
                    _emailAndPassAuth(model, form);
                } else {
                    _emailAndPassAuth(model, form);
                }
            }

            function _emailAndPassAuth(model, form) {
                firebase.auth().signInWithEmailAndPassword(model.email, model.password)
                    .then(function (success) {
                        var user = firebase.auth().currentUser;
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
                document.cookie = "email=" + user.email + ";" + expires + ";path=/";
                document.cookie = "uid=" + user.uid + ";" + expires + ";path=/";
            }

            function _clearFields(form) {
                vm.signUpModel = {};
                form.$setPristine();
                form.$setUntouched();
                window.location = "\/";
            }

            function _deleteCookie(name) {
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            };

            function _signOut() {
                firebase.auth().signOut().then(function () {
                    _deleteCookie("email");
                    _deleteCookie("uid");
                    window.location = "\/";
                }).catch(function (error) {
                });
            }
        }
    })
})();