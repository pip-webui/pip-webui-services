/// <reference path="../../typings/tsd.d.ts" />

module pip.translate {
    'use strict';

    angular.module('pipTranslate', [
        'LocalStorageModule', 'pipTranslate.Service', 'pipTranslate.Filter', 'pipTranslate.Directive'
    ]);

}