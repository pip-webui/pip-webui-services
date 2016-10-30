/* global angular */

(function () {
    'use strict';

    var content = [
        {
            title: 'Translate',
            state: 'translate',
            url: '/translate',
            controller: 'TranslateController',
            templateUrl: 'translate.html'
        },
        {
            title: 'Transaction',
            state: 'transaction',
            url: '/transaction',
            controller: 'TransactionController',
            templateUrl: 'transaction.html'
        },
        {title: 'Timer', state: 'timer', url: '/timer', controller: 'TimerController', templateUrl: 'timer.html'},
        {
            title: 'System Info',
            state: 'system_info',
            url: '/system_info',
            controller: 'SystemInfoController',
            templateUrl: 'system_info.html'
        }
    ];

    var thisModule = angular.module('appServices',
        [
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'ngAnimate', 'pipServices',
            'pipServices',
            'appServices.Timer',
            'appServices.Transaction', 'appServices.Translate',
            'appServices.SystemInfo'
        ]
    );
    thisModule.config(function (pipTranslateProvider, $stateProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider, $logProvider) {

            $logProvider.debugEnabled(true);
            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            for (var i = 0; i < content.length; i++) {
                var contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }

            $urlRouterProvider.otherwise('/translate');
        }
    );

    thisModule.run(function ($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            // String translations
            pipTranslate.setTranslations('en', {
                'APPLICATION_TITLE': 'WebUI Sampler',

                'blue': 'Blue Theme',
                'green': 'Green Theme',
                'pink': 'Pink Theme',
                'grey': 'Grey Theme',
                'en': 'English',
                'ru': 'Russian'
            });

            pipTranslate.setTranslations('ru', {
                'APPLICATION_TITLE': 'WebUI Демонстратор',

                'blue': 'Голубая тема',
                'green': 'Зеленая тема',
                'pink': 'Розовая тема',
                'grey': 'Серая тема',
                'en': 'Английский',
                'ru': 'Русский'
            });
        }
    })

    thisModule.controller('AppController',
        function ($scope, $rootScope, $state, $mdSidenav, $mdMedia, pipTranslate) {

            $scope.$mdMedia = $mdMedia;
            $scope.languages = ['en', 'ru'];

            $scope.content = content;
            $scope.menuOpened = false;

            $scope.onLanguageClick = function (language) {
                pipTranslate.use(language);
            };

            $scope.onSwitchPage = function (state) {
                $mdSidenav('left').close();
                $state.go(state);
            };

            $scope.onToggleMenu = function () {
                $mdSidenav('left').toggle();
            };

            $scope.isActiveState = function (state) {
                return $state.current.name == state;
            };
        }
    );

})();
