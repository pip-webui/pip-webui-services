'use strict';

export function translateDirective(pipTranslate): ng.IDirective {
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

export function translateHtmlDirective(pipTranslate): ng.IDirective {
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
