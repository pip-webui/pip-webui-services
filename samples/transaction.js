/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appCoreServices.Transaction', ['pipUtils.FormErrors']);

    thisModule.config(function (pipTranslateProvider) {
        // This is used for translate sample
        pipTranslateProvider.translations('en', {
            SAMPLE_LOGIN: 'Sample login',
            LOGIN: 'Login',
            PASSWORD: 'Password',
            ERROR_1: 'Login is wrong',
            ERROR_2: 'Password is wrong',
            ERROR_3: 'Account is locked',
            ERROR_4: 'Account is disabled',
            REQUIRED_LOG: 'Please, enter login',
            REQUIRED_PASS: 'Please, enter password',
            EMAIL: 'Your login shall be your email address',
            MIN_LENGTH: 'Password is too short',
            HINT: 'Protect your access with a strong password',
            LOGIN_BUT: 'Login',
            ABORT: 'Abort'
        });
        pipTranslateProvider.translations('ru', {
            SAMPLE_LOGIN: 'Пример логин',
            LOGIN: 'Логин',
            PASSWORD: 'Пароль',
            ERROR_1: 'Неправильный логин',
            ERROR_2: 'Неправильный пароль',
            ERROR_3: 'Аккаунт заблокирован',
            ERROR_4: 'Аккаунт отключен',
            REQUIRED_LOG: 'Введите логин',
            REQUIRED_PASS: 'Введите пароль',
            EMAIL: 'Ваш логин должен быть вашим эл.адресом',
            MIN_LENGTH: 'Пароль склишком короткий',
            HINT: 'Защитите свой доступ с помощью надежного пароля',
            LOGIN_BUT: 'Вход',
            ABORT: 'Отмена'
        });

    });

    thisModule.controller('TransactionController',
        function($scope, $timeout, pipTransaction, pipFormErrors) {
            $scope.data = {
                login: 'johndoe@mail.com',
                password: ''
            };
            $scope.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
            $scope.transaction = pipTransaction('sample_login', $scope);

            var login = function (callback) {
                var error = null;

                switch (_.random(0, 5)) {
                    case 1:
                        error = { code: 1 };
                        break;
                    case 2:
                        error = { code: 2 };
                        break;
                    case 3:
                        error = { code: 3 };
                        break;
                    case 4:
                        error = { code: 4 };
                        break;
                    case 0:
                        error = 'Unknown error';
                        break;
                };

                $timeout(function () {
                    callback(error);
                }, 1000);
            };

            $scope.onProcess = function () {
                if ($scope.form.$invalid) {
                    pipFormErrors.resetFormErrors($scope.form, true);

                    return;
                }

                var tid = $scope.transaction.begin('PROCESSING');
                if (!tid) return;

                login(function (error) {

                    if ($scope.transaction.aborted(tid)) return;
                    $scope.transaction.end(error);

                    if (!error) {
                        pipFormErrors.resetFormErrors($scope.form, false);

                        console.log('Congratulations! You successfully logged in.');
                    } else {
                        pipFormErrors.resetFormErrors($scope.form, true);

                        pipFormErrors.setFormError(
                            $scope.form, error,
                           { 1: 'login', 2: 'password', 3: 'form', 4: 'form' }
                        );
                    }
                });
            };
        }
    );

})();
