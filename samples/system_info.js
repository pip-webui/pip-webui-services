/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appServices.SystemInfo', []);

    thisModule.controller('SystemInfoController',
        function($scope, pipSystemInfo) {

            $scope.browserName = pipSystemInfo.getBrowserName();
            $scope.browserVersion = pipSystemInfo.getBrowserVersion();

            $scope.checkSupported = pipSystemInfo.isSupported();
        }
    );

})();
