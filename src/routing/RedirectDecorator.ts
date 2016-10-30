'use strict';

export let RedirectedStates: any = {};

function decorateRedirectStateProvider($delegate) {
    "ngInject";

    $delegate.redirect = redirect;

    return $delegate;
    /////////////////////////////////////////////

    // Specify automatic redirect from one state to another
    function redirect(fromState, toState) {
        RedirectedStates[fromState] = toState;  
        return this;
    }
}

export function addRedirectStateProviderDecorator($provide) {
    "ngInject";

    $provide.decorator('$state', decorateRedirectStateProvider);
}

function decorateRedirectStateService($delegate, $timeout) {
    "ngInject";

    $delegate.redirect = redirect;
    
    return $delegate;
    ////////////////////////////////
    
    // Todo: Move this code directly to event handler?
    // Todo: Nothing calls this code!!
    function redirect(event, state, params) {
        let toState = RedirectedStates[state.name];
        if (_.isFunction(toState)) {
            toState = toState(state.name, params);

            if (_.isNull(toState))
                throw new Error('Redirected toState cannot be null');
        }

        if (!!toState) {
            $timeout(() => {
                event.preventDefault();
                $delegate.transitionTo(toState, params, {location: 'replace'});
            });

            return true;
        }

        return false;
    }
}

export function addRedirectStateDecorator($provide) {
    "ngInject";

    $provide.decorator('$state', decorateRedirectStateService);
}

