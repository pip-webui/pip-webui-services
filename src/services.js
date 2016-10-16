/**
 * @file Registration of all WebUI services
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipServices', [
        'pipUtils',
        'pipAssert',
        'pipDebug',
        'pipScope',
	    'pipTranslate',
        'pipState',
        'pipTimer',
        'pipSession',
        'pipIdentity',
        'pipSystemInfo',
        'pipFormat',
        'pipScroll',
        'pipTags'
    ]);
    
})();