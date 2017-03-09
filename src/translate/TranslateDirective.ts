import { ITranslateService } from '../translate/ITranslateService';

function translateDirective(pipTranslate): ng.IDirective {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            key1: '@pipTranslate',
            key2: '@key'
        },
        link: (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            let key: string = scope.key1 || scope.key2;
            let value: string = pipTranslate.translate(key);
            element.text(value);
        }
    };
}

function translateHtmlDirective(pipTranslate: ITranslateService): ng.IDirective {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            key1: '@pipTranslateHtml',
            key2: '@key'
        },
        link: (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
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
