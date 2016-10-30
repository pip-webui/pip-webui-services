'use strict';

import './translate/TranslateModule';

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
