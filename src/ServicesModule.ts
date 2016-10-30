'use strict';

import './translate/TranslateModule';
import './session/SessionModule';
import './routing/RoutingModule';
import './utilities/UtilitiesModule';

angular.module('pipServices', [
    'pipTranslate',
    'pipSession',
    'pipScope',
    'pipRouting',
    'pipUtils'
]);
