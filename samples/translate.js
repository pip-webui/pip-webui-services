/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appServices.Translate', ['pipTranslate']);

    thisModule.run(function ($injector) {
        // This is used for translate sample
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        if (pipTranslate) {
            pipTranslate.setTranslations('en', {
                SCOPE1_TEXT: 'This is English text from one scope'
            });
            pipTranslate.setTranslations('en', {
                SCOPE2_TEXT: 'This is English text from another scope',
                SCOPE3_TEXT: 'This is an <b>HTML</b> from <i>another</i> scope'
            });
            pipTranslate.setTranslations('ru', {
                SCOPE1_TEXT: 'Это Русский текст из одного места'
            });
            pipTranslate.setTranslations('ru', {
                SCOPE2_TEXT: 'Это Русский текст из другого места',
                SCOPE3_TEXT: 'Это фрагмент <b>HTML</b> из <i>другого</i> места'
            });
        }

    });

    thisModule.controller('TranslateController',
        function ($scope) {

        }
    );

})();
