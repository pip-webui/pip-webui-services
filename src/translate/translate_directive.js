/**
 * @file Translatation directives
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Directive', ['pipTranslate.Service']);

    thisModule.directive('pipTranslate', function(pipTranslate) {
        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslate',
                key2: '@key'
            },
            link: function (scope, element, attrs) {
                var key = scope.key1 || scope.key2;
                var value = pipTranslate.translate(key);
                element.text(value);
            }

        };
    });

    thisModule.directive('pipTranslateHtml', function(pipTranslate) {
        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslateHtml',
                key2: '@key'
            },
            link: function (scope, element, attrs) {
                var key = scope.key1 || scope.key2;
                var value = pipTranslate.translate(key);
                element.html(value);
            }

        };
    });

})();