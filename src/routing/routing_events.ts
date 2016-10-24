/// <reference path="../../typings/tsd.d.ts" />

module pip.routing {
    'use strict';

    export let RoutingVar: string = "$routing";

    function hookRoutingEvents($log, $rootScope, $state) {
        "ngInject";

        $rootScope.$on('$stateChangeStart',
            (event, toState, toParams, fromState, fromParams) => {
                $rootScope[RoutingVar] = true;
            }
        );

        $rootScope.$on('$stateChangeSuccess',
            (event, toState, toParams, fromState, fromParams) => {
                // Unset routing variable to disable page transition
                $rootScope[RoutingVar] = false;                
            }
        );

        // Intercept route error
        $rootScope.$on('$stateChangeError',
            (event, toState, toParams, fromState, fromParams, error) => {
                // Unset routing variable to disable page transition
                $rootScope[RoutingVar] = false;

                $log.error('Error while switching route to ' + toState.name);
                $log.error(error);

                console.error('Error while switching route to ' + toState.name);
                console.error(error);
            }
        );

        // Intercept route error
        $rootScope.$on('$stateNotFound',
            function(event, unfoundState, fromState, fromParams) {
                event.preventDefault();

                $rootScope[RoutingVar] = false;

                // Todo: Move to errors
                $state.go('errors_missing_route',  {
                        unfoundState: unfoundState,
                        fromState : {
                            to: fromState ? fromState.name : '',
                            fromParams: fromParams
                        }
                    }
                );
            }
        );

    }
    
    angular
        .module('pipRouting.Events', [])
        .run(hookRoutingEvents);

}