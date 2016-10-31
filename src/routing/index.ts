'use strict';

angular.module('pipRouting', ['ui.router']);

import './BackDecorator';
import './RedirectDecorator';
import './RoutingEvents';

export * from './BackDecorator';
export * from './RoutingEvents';
