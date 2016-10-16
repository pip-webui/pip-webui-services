/**
 * @file Filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Filter', ['pipTranslate.Service']);

    thisModule.filter('translate', function (pipTranslate) {
        return function (key) {
            return pipTranslate.translate(key) || key;
        }
    });

})();
