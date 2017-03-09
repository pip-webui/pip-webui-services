import './translate';
import './session';
import './transactions';
import './routing';
import './utilities';

angular.module('pipServices', [
    'pipTranslate',
    'pipSession',
    'pipTransaction',
    'pipRouting',
    'pipFormat',
    'pipTimer',
    'pipScroll',
    'pipTags',
    'pipCodes',
    'pipSystemInfo',
    'pipPageReset'
]);

export * from './translate';
export * from './session';
export * from './transactions';
export * from './routing';
export * from './utilities';
