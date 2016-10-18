/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appServices.Transaction', []);

    thisModule.config(function (pipTranslateProvider) {
        // This is used for translate sample
        pipTranslateProvider.translations('en', {
            TRANSACTION_SAMPLE: 'Login',
            START_BUT: 'Start transaction',
            ABORT: 'Abort'
        });
        pipTranslateProvider.translations('ru', {
            TRANSACTION_SAMPLE: 'Пример для транзакций',
            START_BUT: 'Начать транзакцию',
            ABORT: 'Отмена'
        });

    });

    thisModule.controller('TransactionController',
        function($scope, $timeout, pipTransaction) {

            $scope.transaction = pipTransaction('sample_login', $scope);

            $scope.onProcess = function () {
                var tid = $scope.transaction.begin('PROCESSING');
                
                if (!tid) return;

                $timeout(function () {
                    if ($scope.transaction.aborted(tid)) {
                        console.log('Tansaction aborted.');

                        return;
                    }
                    
                    console.log('End Transaction.');                    
                    $scope.transaction.end();
                }, 1000);
            };
        }
    );

})();
