/**
 * @file Application router extended from ui.router
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';
    
    var thisModule = angular.module('pipState', ['ui.router', 'pipTranslate', 'pipAssert']);

    thisModule.config(
        function($locationProvider, $httpProvider, pipTranslateProvider) {
            // Switch to HTML5 routing mode
            //$locationProvider.html5Mode(true);
            pipTranslateProvider.translations('en', {
                'ERROR_SWITCHING': 'Error while switching route. Try again.'
            });

            pipTranslateProvider.translations('ru', {
                'ERROR_SWITCHING': 'Ошибка при переходе. Попробуйте ещё раз.'
            });
        }
    );

    thisModule.run(
        function($rootScope, pipTranslate, $state) {
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    // Unset routing variable to disable page transition
                    $rootScope.$routing = false;
                    // Record current and previous state
                    $rootScope.$state = {name: toState.name, url: toState.url, params: toParams};
                    $rootScope.$prevState = {name: fromState.name, url: fromState.url, params: fromParams};
                }
            );

            // Intercept route error
            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    // Unset routing variable to disable page transition
                    $rootScope.$routing = false;

                    console.error('Error while switching route to ' + toState.name);
                    console.error(error);
                }
            );


            // Intercept route error
            $rootScope.$on('$stateNotFound',
                function(event, unfoundState, fromState, fromParams) {
                    event.preventDefault();

                    // todo make configured error state name
                    $state.go('errors_missing_route',  {
                            unfoundState: unfoundState,
                            fromState : {
                                to: fromState ? fromState.name : '',
                                fromParams: fromParams
                            }
                        }
                    );
                    $rootScope.$routing = false;
                }
            );

        }
    );

    thisModule.provider('pipState', function($stateProvider, pipAssertProvider) {
        // Configuration of redirected states
        var redirectedStates = {};

        this.redirect = setRedirect;
        this.state = $stateProvider.state;

        this.$get = function ($state, $timeout, pipAssert) {
            $state.redirect = redirect;
            $state.goBack = goBack;
            $state.goBackAndSelect = goBackAndSelect;
            
            return $state;
            
			//------------------------
            
            function redirect(event, state, params, $rootScope) {
                pipAssert.contains(state, 'name', "$state.redirect: state should contains name prop");
                pipAssert.isObject(params, "$state.redirect: params should be an object");

                var toState;

                $rootScope.$routing = true;
                toState = redirectedStates[state.name];
                if (_.isFunction(toState)) {
                    toState = toState(state.name, params, $rootScope);

                    if (_.isNull(toState)) {
                        $rootScope.$routing = false;
                        throw new Error('Redirected toState cannot be null');
                    }
                }

                if (!!toState) {
                    $timeout(function() {
                        event.preventDefault();
                        $state.transitionTo(toState, params, {location: 'replace'});
                    });

                    return true;
                }

                return false;
            }

            function goBack() {
                $window.history.back()
            }

            function goBackAndSelect(obj, objParamName, id, idParamName) {
                pipAssert.isObject(obj, 'pipUtils.goBack: first argument should be an object');
                pipAssert.isString(idParamName, 'pipUtils.goBack: second argument should a string');
                pipAssert.isString(objParamName, 'pipUtils.goBack: third argument should a string');
                    
                if ($rootScope.$prevState && $rootScope.$prevState.name) {
                    var state = _.cloneDeep($rootScope.$prevState);

                    state.params[idParamName] = id;
                    state.params[objParamName] = obj;

                    $state.go(state.name, state.params);
                } else {
                    $window.history.back();
                }
            }
        };

        return;        
        //------------------

        // Specify automatic redirect from one state to another
        function setRedirect(fromState, toState) {
            pipAssertProvider.isNotNull(fromState, "pipState.redirect: fromState cannot be null");
            pipAssertProvider.isNotNull(toState, "pipState.redirect: toState cannot be null");
            
            redirectedStates[fromState] = toState;  

            return this;
        };

    });

})();