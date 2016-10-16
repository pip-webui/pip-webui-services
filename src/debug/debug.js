/**
 * @file Debugging service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDebug', []);

    thisModule.provider('pipDebug', function ($logProvider) {

        this.enabled = true;

        return {
            enable: enable,
            disable: disable,
            enabled: enabled,
            
            $get: function($log) {
                return {
                    enabled: enabled,
                    log: $log.log,
                    info: $log.info,
                    warn: $log.warn,
                    error: $log.error,
                    debug: $log.debug
                }
            }
        };

        function enabled() {
            return this.enabled;
        }

        function enable() {
            this.enabled = true;
            $logProvider.debugEnabled(true);
        }

        function disable() {
            this.enabled = false;
            $logProvider.debugEnabled(false);
        }

    });

})();
