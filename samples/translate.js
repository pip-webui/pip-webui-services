/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appCoreServices.Translate', []);

    thisModule.config(function (pipTranslateProvider) {
        // This is used for translate sample
        pipTranslateProvider.translations('en', {
            SCOPE1_TEXT: 'This is English text from one scope'
        });
        pipTranslateProvider.translations('en', {
            SCOPE2_TEXT: 'This is English text from another scope',
            SCOPE3_TEXT: 'This is an <b>HTML</b> from <i>another</i> scope'
        });
        pipTranslateProvider.translations('ru', {
            SCOPE1_TEXT: 'Это Русский текст из одного места'
        });
        pipTranslateProvider.translations('ru', {
            SCOPE2_TEXT: 'Это Русский текст из другого места',
            SCOPE3_TEXT: 'Это фрагмент <b>HTML</b> из <i>другого</i> места'
        });
    });

    thisModule.controller('TranslateController',
        function($scope) {

        }
    );

})();
