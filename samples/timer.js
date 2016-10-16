/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appCoreServices.Timer', ['pipTimer']);

    thisModule.config(function (pipTranslateProvider) {
        // This is used for translate sample
        pipTranslateProvider.translations('en', {
            START: 'Start',
            STOP: 'Stop',
            SECONDS: 'Seconds',
            AUTO_UPDATE: 'Auto update page',
            AUTO_PULL: 'Auto pull',
            BROADCAST_COUNT: 'broadcasts count: '
        });
        pipTranslateProvider.translations('ru', {
            START: 'Старт',
            STOP: 'Стоп',
            SECONDS: 'секунд(ы)',
            AUTO_UPDATE: 'Автообновление',
            AUTO_PULL: 'Автодобавление',
            BROADCAST_COUNT: 'кол-во broadcast: '
        });

    });

    thisModule.controller('TimerController',
        function($scope, pipTimer) {
            var startTimePull = null,
                startTimeUpdate = null;


            $scope.onStartClick = function () {
                pipTimer.start();
                $scope.autoPullCount = 0;
                $scope.autoUpdateCount = 0;
                startTimePull = new Date();
                startTimeUpdate = new Date();
            }

            $scope.onStopClick = function () {
                pipTimer.stop();
                startTimePull = null;
                startTimeUpdate = null;
            }

            $scope.getAutoPullDif = function () {
                var now = new Date();
                var dif = Math.floor((now - startTimePull) / 1000);
                if (dif > 14) startTimePull = new Date();
                return dif;
            };

            $scope.isStarted = pipTimer.isStarted;

            $scope.getAutoUpdateDif = function () {
                var now = new Date();
                var dif = Math.floor((now - startTimeUpdate) / 1000);
                if (dif > 59) startTimeUpdate = new Date();
                return dif;
            }

            $scope.$on('pipAutoPullChanges', function () {
                $scope.autoPullCount ++;
            });

            $scope.$on('pipAutoUpdatePage', function () {
                $scope.autoUpdateCount ++;
            });
        }
    );

})();
