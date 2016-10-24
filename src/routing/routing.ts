/// <reference path="../../typings/tsd.d.ts" />

module pip.routing {
    'use strict';
    
    angular.module('pipRouting', [
        'ui.router', 'pipRouting.Events', 'pipRouting.Back', 'pipRouting.Redirect'
    ]);
}