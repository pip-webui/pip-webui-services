'use strict';

export function translateFilter(pipTranslate) {
    "ngInject";

    return function (key) {
        return pipTranslate.translate(key) || key;
    }
}

export function optionalTranslateFilter($injector) {
    "ngInject";

    let pipTranslate = $injector.has('pipTranslate') 
        ? $injector.get('pipTranslate') : null;

    return function (key) {
        return pipTranslate  ? pipTranslate.translate(key) || key : key;
    }
}
