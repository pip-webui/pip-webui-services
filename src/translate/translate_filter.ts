/// <reference path="../../typings/tsd.d.ts" />

module pip.translate {
    'use strict';

    function translateFilter(pipTranslate) {
        "ngInject";

        return function (key) {
            return pipTranslate.translate(key) || key;
        }
    }

    function optionalTranslateFilter($injector) {
        "ngInject";

        let pipTranslate = $injector.has('pipTranslate') 
            ? $injector.get('pipTranslate') : null;

        return function (key) {
            return pipTranslate  ? pipTranslate.translate(key) || key : key;
        }
    }

    angular
        .module('pipTranslate')
        .filter('translate', translateFilter);

}
