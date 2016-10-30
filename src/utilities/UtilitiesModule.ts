'use strict';

import { Format } from './Format';
import { Tags } from './Tags';
import { Codes } from './Codes';
import { SystemInfo } from './SystemInfo';
import { TimerService } from './TimerService';
import { ScrollService } from './ScrollService';

angular.module('pipFormat', []).service('pipFormat', Format);
angular.module('pipTags', []).service('pipTags', Tags);
angular.module('pipCodes', []).service('pipCodes', Codes);
angular.module('pipSystemInfo', []).service('pipSystemInfo', SystemInfo);
angular.module('pipTimer', []).service('pipTimer', TimerService);
angular.module('pipScroll', []).service('pipScroll', ScrollService);

import { PageResetService } from './PageResetService';
import { hookResetEvents } from './PageResetService';

angular.module('pipPageReset', [])
    .service('pipPageReset', PageResetService)
    .run(hookResetEvents);

angular
    .module('pipUtils', [
        'pipFormat',
        'pipTimer',
        'pipScroll',
        'pipTags',
        'pipCodes',
        'pipSystemInfo',
        'pipPageReset'
    ]);

