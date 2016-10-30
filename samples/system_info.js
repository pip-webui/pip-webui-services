/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appServices.SystemInfo', []);

    thisModule.controller('SystemInfoController',
        function($scope, pipSystemInfo) {

            $scope.browserName = pipSystemInfo.browserName;
            $scope.browserVersion = pipSystemInfo.browserVersion;

            $scope.checkSupported = pipSystemInfo.isSupported();
        }
    );

})();
