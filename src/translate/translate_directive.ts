/// <reference path="../../typings/tsd.d.ts" />

module pip.translate {
    'use strict';

    function pipTranslateDirective(pipTranslate): ng.IDirective {
        "ngInject";

        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslate',
                key2: '@key'
            },
            link: (scope: any, element: any, attrs: any) => {
                let key = scope.key1 || scope.key2;
                let value = pipTranslate.translate(key);
                element.text(value);
            }
        };
    }

    function pipTranslateHtmlDirective(pipTranslate): ng.IDirective {
        "ngInject";

        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslateHtml',
                key2: '@key'
            },
            link: (scope: any, element: any, attrs: any) => {
                let key = scope.key1 || scope.key2;
                let value = pipTranslate.translate(key);
                element.html(value);
            }
        };
    }

    angular
        .module('pipTranslate')
        .directive('pipTranslate', pipTranslateDirective)
        .directive('pipTranslateHtml', pipTranslateHtmlDirective);

}