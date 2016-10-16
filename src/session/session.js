/**
 * @file Session service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSession', []);

    thisModule.provider('pipSession', function($timeout, pipAssertProvider) {
        var 
            setRoot = true,
            session = null;

        this.setRoot = initSetRoot;
        this.session = initSession;

        this.$get = function ($rootScope, pipAssert) {
            // Set root variable
            if (setRoot)
                $rootScope.$session = session;
            
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

            function startSession(newSession, fullReset, partialReset) {
                pipAssert.isObject(newSession || '', "pipSession.start: argument should be an object");

                session = newSession;

                if (setRoot)
                    $rootScope.$session = session;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionStarted', session);
            }

            function stopSession(fullReset, partialReset) {
                var oldSession = session;
                session = null;

                if (setRoot)
                    $rootScope.$session = session;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionStopped', oldSession);
            }

            function getSession() {
                return session;
            }

            return {
                get: getSession,
                start: startSession,
                stop: stopSession
            }
        };

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipSessionProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Initialize session
        function initSession(newSession) {
            if (newSession != null) {
                pipAssertProvider.isObject(newSession || '', "pipSessionProvider.session: argument should be an object");
                session = newSession;
            }
            return session;  
        }

    });

})();