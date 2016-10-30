'use strict';

import './translate/TranslateModule';
import './session/SessionModule';
import './transactions/TransactionModule';
import './routing/RoutingModule';
import './utilities/Format';
import './utilities/TimerService';
import './utilities/ScrollService';
import './utilities/Tags';
import './utilities/Codes';
import './utilities/SystemInfo';
import './utilities/PageResetService';

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
