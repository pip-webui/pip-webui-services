'use strict';

function translateFilter(pipTranslate: pip.services.ITranslateService) {
    "ngInject";

    return function (key: string) {
        return pipTranslate.translate(key) || key;
    }
}

function optionalTranslateFilter($injector: ng.auto.IInjectorService) {
    "ngInject";

    let pipTranslate: pip.services.ITranslateService = $injector.has('pipTranslate') 
        ? <pip.services.ITranslateService>$injector.get('pipTranslate') : null;

    return function (key: string) {
        return pipTranslate  ? pipTranslate.translate(key) || key : key;
    }
}

angular
    .module('pipTranslate')
    .filter('translate', translateFilter);
