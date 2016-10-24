/// <reference path="../../typings/tsd.d.ts" />

module pip.routing {
    'use strict';

    export let CurrentState: any;
    export let PreviousState: any;

    function captureStateTranslations($rootScope) {
        "ngInject";

        $rootScope.$on('$stateChangeSuccess',
            (event, toState, toParams, fromState, fromParams) => {
                pip.routing.CurrentState = {
                    name: toState.name, 
                    url: toState.url, 
                    params: toParams
                };

                pip.routing.PreviousState = {
                    name: fromState.name, 
                    url: fromState.url, 
                    params: fromParams
                };
            }
        );

    }
    
    function decorateBackStateService($delegate, $window) {
        "ngInject";

        $delegate.goBack = goBack;
        $delegate.goBackAndSelect = goBackAndSelect;

        return $delegate;
        //////////////////////////////////////////////////

        function goBack(): void {
            $window.history.back()
        }

        function goBackAndSelect(params: any): void {
            if (pip.routing.PreviousState != null 
                && pip.routing.PreviousState.name != null) {

                let state = _.cloneDeep(pip.routing.PreviousState);

                // Override selected parameters
                state.params = _.extend(state.params, params);

                $delegate.go(state.name, state.params);
            } else {
                $window.history.back();
            }
        }
    }

    function addBackStateDecorator($provide) {
        $provide.decorator('$state', decorateBackStateService);
    }

    angular
        .module('pipRouting.Back', [])
        .config(addBackStateDecorator)
        .run(captureStateTranslations);

}