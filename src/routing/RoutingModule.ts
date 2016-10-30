'use strict';

import { addBackStateDecorator } from './BackDecorator';
import { captureStateTranslations } from './BackDecorator';
import { addRedirectStateDecorator } from './RedirectDecorator';
import { addRedirectStateProviderDecorator } from './RedirectDecorator';
import { hookRoutingEvents } from './RoutingEvents';

angular
    .module('pipRouting', ['ui.router'])
    .config(addBackStateDecorator)
    .run(captureStateTranslations)
    .config(addRedirectStateProviderDecorator)
    .config(addRedirectStateDecorator)
    .run(hookRoutingEvents);
    