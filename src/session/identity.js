/**
 * @file Identity service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipIdentity', ['pipPageReset']);

    thisModule.provider('pipIdentity', function(pipAssertProvider) {
        var 
            setRoot = true,
            identity = null;

        this.setRoot = initSetRoot;
        this.identity = initIdentity;

        this.$get = function ($rootScope, $timeout, pipAssert, pipPageReset) {
            // Set root variable
            if (setRoot)
                $rootScope.$identity = identity;

            function getIdentity() {
                return identity;
            }

            function setIdentity(newIdentity, fullReset, partialReset) {
                if (newIdentity != null)
                    pipAssert.isObject(newIdentity || '', "pipIdentity.set: argument should be an object");

                identity = newIdentity;

                if (setRoot)
                    $rootScope.$identity = identity;

                pipPageReset.reset(fullReset, partialReset);

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