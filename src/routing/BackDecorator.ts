'use strict';

export let CurrentState: any;
export let PreviousState: any;

function captureStateTranslations($rootScope: ng.IRootScopeService) {
    "ngInject";

    $rootScope.$on('$stateChangeSuccess',
        (event, toState, toParams, fromState, fromParams) => {
            CurrentState = {
                name: toState.name, 
                url: toState.url, 
                params: toParams
            };

            PreviousState = {
                name: fromState.name, 
                url: fromState.url, 
                params: fromParams
            };
        }
    );

}

function decorateBackStateService($delegate: any, $window: ng.IWindowService): any {
    "ngInject";

    $delegate.goBack = goBack;
    $delegate.goBackAndSelect = goBackAndSelect;

    return $delegate;
    //////////////////////////////////////////////////

    function goBack(): void {
        $window.history.back()
    }

    function goBackAndSelect(params: any): void {
        // todo: define end fix PreviousState
        if (PreviousState != null 
            && PreviousState.name != null) {

            let state = _.cloneDeep(PreviousState);

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
    .module('pipRouting')
    .config(addBackStateDecorator)
    .run(captureStateTranslations);
    