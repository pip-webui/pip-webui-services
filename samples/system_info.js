/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appCoreServices.SystemInfo', []);

    thisModule.controller('SystemInfoController',
        function($scope, pipUtils) {
            $scope.browser = pipUtils.getBrowser();

            $scope.checkSupported = pipUtils.checkSupported();
        }


    );

})();
