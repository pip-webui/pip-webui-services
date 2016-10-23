/// <reference path="../../typings/tsd.d.ts" />

(function () {
    'use strict';

    var thisModule = angular.module('pipPageReset', []);

    thisModule.factory('pipPageReset', function($rootScope, $timeout) {

        $rootScope.$on('pipResetPage', resetAll);

        return {
            resetPartial: resetPartial,
            resetFull: resetFull,
            resetAll: resetAll,
            reset: reset
        };

        //------------------------------------------

        function resetPartial() {
            reset(false, true);
        }

        function resetFull() {
            reset(true, false);
        }

        function resetAll() {
            reset(true, true);
        }

        function reset(full, partial) {
            full = full !== undefined ? !!full : true;
            partial = partial !== undefined ? !!partial : true;

            if (full || partial) {
                $rootScope.$reset = full;
                $rootScope.$partialReset = partial;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }
        }

    });

})();