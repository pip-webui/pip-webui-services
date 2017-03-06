'use strict';

function translateDirective(pipTranslate): ng.IDirective {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            key1: '@pipTranslate',
            key2: '@key'
        },
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            let key: string = scope.key1 || scope.key2;
            let value: string = pipTranslate.translate(key);
            element.text(value);
        }
    };
}

function translateHtmlDirective(pipTranslate: pip.services.ITranslateService): ng.IDirective {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            key1: '@pipTranslateHtml',
            key2: '@key'
        },
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            let key: string = scope.key1 || scope.key2;
            let value: string = pipTranslate.translate(key);
            element.html(value);
        }
    };
}

angular
    .module('pipTranslate')
    .directive('pipTranslate', translateDirective)
    .directive('pipTranslateHtml', translateHtmlDirective);
