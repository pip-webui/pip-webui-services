import { ITranslateService } from './ITranslateService';

function translateFilter(pipTranslate: ITranslateService) {
    "ngInject";

    return function (key: string) {
        return pipTranslate.translate(key) || key;
    }
}

function optionalTranslateFilter($injector: ng.auto.IInjectorService) {
    "ngInject";

    let pipTranslate: ITranslateService = $injector.has('pipTranslate') 
        ? <ITranslateService>$injector.get('pipTranslate') : null;

    return function (key: string) {
        return pipTranslate  ? pipTranslate.translate(key) || key : key;
    }
}

angular
    .module('pipTranslate')
    .filter('translate', translateFilter);
