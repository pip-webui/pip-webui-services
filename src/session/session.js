/**
 * @file Session service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSession', ['pipPageReset']);

    thisModule.provider('pipSession', function(pipAssertProvider) {
        var 
            setRoot = true,
            session = null;

        this.setRoot = initSetRoot;
        this.session = initSession;

        this.$get = function ($rootScope, $timeout, pipAssert, pipPageReset) {
            // Set root variable
            if (setRoot)
                $rootScope.$session = session;
            
            function openSession(newSession, fullReset, partialReset) {
                pipAssert.isObject(newSession || '', "pipSession.open: argument should be an object");

                session = newSession;

                if (setRoot)
                    $rootScope.$session = session;

                pipPageReset.reset(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionOpened', session);
            }

            function closeSession(fullReset, partialReset) {
                var oldSession = session;
                session = null;

                if (setRoot)
                    $rootScope.$session = session;

                pipPageReset.reset(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionClosed', oldSession);
            }

            function getSession() {
                return session;
            }

            return {
                get: getSession,
                open: openSession,
                close: closeSession
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

})(window.angular, window._);