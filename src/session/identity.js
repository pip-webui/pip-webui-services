/**
 * @file Identity service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipIdentity', []);

    thisModule.provider('pipIdentity', function($timeout, pipAssertProvider) {
        var 
            setRoot = true,
            identity = null;

        this.setRoot = initSetRoot;
        this.identity = initIdentity;

        this.$get = function ($rootScope, pipAssert) {
            // Set root variable
            if (setRoot)
                $rootScope.$identity = identity;

            function getIdentity() {
                return identity;
            }

            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function setIdentity(newIdentity, fullReset, partialReset) {
                if (newIdentity != null)
                    pipAssert.isObject(newIdentity || '', "pipIdentity.set: argument should be an object");

                identity = newIdentity;

                if (setRoot)
                    $rootScope.$identity = identity;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipIdentityChanged', identity);
            }

            return {
                get: getIdentity,
                set: setIdentity,
            }
        };

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipIdentityProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Initialize identity
        function initIdentity(newIdentity) {
            if (newIdentity != null) {
                pipAssertProvider.isObject(newIdentity || '', "pipIdentityProvider.identity: argument should be an object");
                identity = newIdentity;
            }
            return identity;  
        }

    });

})();