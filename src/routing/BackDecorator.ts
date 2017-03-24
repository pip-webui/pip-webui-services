export let StateVar: string = "$state";
export let PrevStateVar: string = "$prevState";

// Run function to set CurrentState and PreviousState global variables
function captureStateTranslations($rootScope: ng.IRootScopeService) {
    "ngInject";

    $rootScope.$on('$stateChangeSuccess',
        (event, toState, toParams, fromState, fromParams) => {

            let CurrentState = {
                name: toState.name, 
                url: toState.url, 
                params: toParams
            };

            let PreviousState = {
                name: fromState.name, 
                url: fromState.url, 
                params: fromParams
            };
        // Record current and previous state
        $rootScope[StateVar] = CurrentState;
        $rootScope[PrevStateVar] = PreviousState;            
        }
    );

}

// Decorator function to modify $state service by adding goBack and goBackAndSelect methods
function decorateBackStateService($delegate: any, $window: ng.IWindowService, $rootScope: ng.IRootScopeService): any {
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
        if (!!$rootScope[StateVar] && !!$rootScope[PrevStateVar]) {

            let state = _.cloneDeep($rootScope[PrevStateVar]);

            // Override selected parameters
            state.params = _.extend(state.params, params);

            $delegate.go(state.name, state.params);
        } else {
            $window.history.back();
        }
    }
}

// Config function to decorate $state service
function addBackStateDecorator($provide) {
    $provide.decorator('$state', decorateBackStateService);
}

angular
    .module('pipRouting')
    .config(addBackStateDecorator)
    .run(captureStateTranslations);
    