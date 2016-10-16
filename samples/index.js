/* global angular */

(function () {
    'use strict';

    var content = [
        { title: 'Translate', state: 'translate', url: '/translate', controller: 'TranslateController', templateUrl: 'translate.html' },
        //{ title: 'Error', state: 'error', url: '/error', controller: 'ErrorController', templateUrl: 'error.html' },
        { title: 'Transaction', state: 'transaction', url: '/transaction', controller: 'TransactionController', templateUrl: 'transaction.html' },
        { title: 'Timer', state: 'timer', url: '/timer', controller: 'TimerController', templateUrl: 'timer.html' },
        { title: 'System Info', state: 'system_info', url: '/system_info', controller: 'SystemInfoController', templateUrl: 'system_info.html' }
    ];

    var thisModule = angular.module('appCoreServices', 
        [
            // 3rd Party Modules
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate', 
			'pipCore',
            'appCoreServices.Error', 'appCoreServices.Timer',
            'appCoreServices.Transaction', 'appCoreServices.Translate',
            'appCoreServices.SystemInfo'
        ]
    );

    thisModule.config(function (pipTranslateProvider, $stateProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider) {

            $mdIconProvider.iconSet('icons', '../images/icons.svg', 512);
//             $mdThemingProvider.theme('blue')
//                 .primaryPalette('blue')
//                 .accentPalette('green');
// 
//             $mdThemingProvider.theme('pink')
//                 .primaryPalette('pink')
//                 .accentPalette('orange');
// 
//             $mdThemingProvider.theme('green')
//                 .primaryPalette('green')
//                 .accentPalette('purple');
// 
//             $mdThemingProvider.theme('grey')
//                 .primaryPalette('grey')
//                 .accentPalette('yellow');
// 
//             $mdThemingProvider.setDefaultTheme('blue');

            // String translations
            pipTranslateProvider.translations('en', {
                'APPLICATION_TITLE': 'WebUI Sampler',

                'blue': 'Blue Theme',
                'green': 'Green Theme',
                'pink': 'Pink Theme',
                'grey': 'Grey Theme',
                'en': 'English',
                'ru': 'Russian'
            });

            pipTranslateProvider.translations('ru', {
                'APPLICATION_TITLE': 'WebUI Демонстратор',

                'blue': 'Голубая тема',
                'green': 'Зеленая тема',
                'pink': 'Розовая тема',
                'grey': 'Серая тема',
                'en': 'Английский',
                'ru': 'Русский'
            });

            for (var i = 0; i < content.length; i++) {
                var contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }
                
            $urlRouterProvider.otherwise('/translate');
        } 
    );

    thisModule.controller('AppController', 
        function ($scope, $rootScope, $state, $mdSidenav, pipTranslate) {
            $scope.languages = ['en', 'ru'];
            $scope.themes = ['blue', 'green', 'pink', 'grey'];

            $scope.selected = {
                theme: 'blue',
                tab: 0  
            };

            $scope.content = content;
            $scope.menuOpened = false;

            $scope.onLanguageClick = function(language) {
                pipTranslate.use(language);
            };

            $scope.onThemeClick = function(theme) {
                $rootScope.$theme = theme;
            };

                        
            $scope.onSwitchPage = function(state) {
                $mdSidenav('left').close();
                $state.go(state);
            };
            
            $scope.onToggleMenu = function() {
                $mdSidenav('left').toggle();
            };
                        
            $scope.isActiveState = function(state) {
                return $state.current.name == state;  
            };
        }
    );

})();
