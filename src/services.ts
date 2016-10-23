/// <reference path="../typings/tsd.d.ts" />

(function () {
    'use strict';

    angular.module('pipServices', [
        'pipScope',
	    'pipTranslate',
        'pipRouting',
        'pipTimer',
        'pipSession',
        'pipIdentity',
        'pipSystemInfo',
        'pipFormat',
        'pipScroll',
        'pipPageReset',        
        'pipTags'
    ]);
    
})();