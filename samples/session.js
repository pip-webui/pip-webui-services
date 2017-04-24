/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appServices.Session', []);

    thisModule.run(function ($injector) {
        // This is used for translate sample
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate && pipTranslate.translations) {
            pipTranslate.translations('en', {
                OPEN_SESSION: 'Open session',
                CLOSE_SESSION: 'Close Session'
            });
            pipTranslate.translations('ru', {
                OPEN_SESSION: 'Открыть сессию',
                CLOSE_SESSION: 'Закрыть сессию'
            });
        }
        

    });

    thisModule.controller('SessionController',
        function($scope, $rootScope, $timeout, pipSession) {
            let names = ['Jacob', 'Michael', 'Joshua', 'Matthew', 'Andrew', 'Daniel', 
                'Anthony', 'Christopher', 'Joseph', 'William', 'Alexander']


            $rootScope.$on('pipSessionOpened', (event, openedSession) => {
                console.log('Seesion opened', openedSession);
            });

            $rootScope.$on('pipSessionClosed', (event, closedSession) => {
                console.log('Seesion closed', closedSession);
            });

            $scope.isSessionOpen = isSessionOpen;
            $scope.onStartClick = onStartClick;
            $scope.onStopClick = onStopClick;


            let listeners1 = (callback) => {
                $timeout(function() {
                    console.log('listeners1 fire');
                    callback();
                }, 1000);
            };
            let listeners2 = (callback) => {
                $timeout(function() {
                    console.log('listeners2 fire');
                    callback();
                }, 2000);
            };            
            // add openListeners
            pipSession.addOpenListener(listeners1);
            pipSession.addOpenListener(listeners2);

            return;

            function getName() {
                let index = Math.floor(Math.random() * names.length);

                return names[index];
            }

            function getSession() {
                let session = {
                    sessionId: new Date().getTime().toString(),
                    userName: getName()
                }

                return session;
            }

            function onStartClick() {
                pipSession.open(getSession());
            }

            function onStopClick() {
                pipSession.close();
            }

            function isSessionOpen() {
                return pipSession.isOpened();
            }

        }
    );

})();
