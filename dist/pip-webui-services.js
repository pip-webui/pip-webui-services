/**
 * @file Registration of all WebUI services
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipServices', [
        'pipUtils',
        'pipAssert',
        'pipDebug',
        'pipScope',
	    'pipTranslate',
        'pipState',
        'pipTimer',
        'pipSession',
        'pipIdentity',
        'pipSystemInfo',
        'pipFormat',
        'pipScroll',
        'pipTags'
    ]);
    
})();
/**
 * @file Assertion utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipAssert', ['pipDebug']);

    thisModule.provider('pipAssert', ['pipDebugProvider', function (pipDebugProvider) {

        return {
            isEmpty: pipDebugProvider.enabled() ? isEmpty : noop,
            isObjectId: pipDebugProvider.enabled() ? isObjectId : noop,
            isDefined: pipDebugProvider.enabled() ? isDefined : noop,
            isDef: pipDebugProvider.enabled() ? isDefined : noop,
            contains: pipDebugProvider.enabled() ? contains : noop,
            equal: pipDebugProvider.enabled() ? equal : noop,
            notEqual: pipDebugProvider.enabled() ? notEqual : noop,
            strictEqual: pipDebugProvider.enabled() ? strictEqual : noop,
            notStrictEqual: pipDebugProvider.enabled() ? notStrictEqual : noop,
            isArray: pipDebugProvider.enabled() ? isArray : noop,
            isBoolean: pipDebugProvider.enabled() ? isBoolean : noop,
            isNumber: pipDebugProvider.enabled() ? isNumber : noop,
            isString: pipDebugProvider.enabled() ? isString : noop,
            isObject: pipDebugProvider.enabled() ? isObject : noop,
            isDate: pipDebugProvider.enabled() ? isDate : noop,
            isError: pipDebugProvider.enabled() ? isError : noop,
            isFunction: pipDebugProvider.enabled() ? isFunction : noop,
            isNotNull: pipDebugProvider.enabled() ? isNotNull : noop,
            
            $get: ['pipDebug', function(pipDebug) {
                return {
                    isEmpty: pipDebug.enabled() ? isEmpty : noop,
                    isObjectId: pipDebug.enabled() ? isObjectId : noop,
                    isDefined: pipDebug.enabled() ? isDefined : noop,
                    isDef: pipDebug.enabled() ? isDefined : noop,
                    contains: pipDebug.enabled() ? contains : noop,
                    equal: pipDebug.enabled() ? equal :  noop,
                    notEqual: pipDebug.enabled() ? notEqual : noop,
                    strictEqual: pipDebug.enabled() ? strictEqual : noop,
                    notStrictEqual: pipDebug.enabled() ? notStrictEqual :  noop,
                    isArray: pipDebug.enabled() ? isArray : noop,
                    isBoolean: pipDebug.enabled() ? isBoolean : noop,
                    isNumber: pipDebug.enabled() ? isNumber : noop,
                    isString: pipDebug.enabled() ? isString : noop,
                    isObject: pipDebug.enabled() ? isObject : noop,
                    isDate: pipDebug.enabled() ? isDate : noop,
                    isError: pipDebug.enabled() ? isError : noop,
                    isFunction: pipDebug.enabled() ? isFunction : noop,
                    isNotNull: pipDebug.enabled() ? isNotNull : noop
                }
            }]
        };

        function noop() {}

        function objectToString(o) {
            return Object.prototype.toString.call(o);
        }

        function isArray(arg, message) {
            if (!Array.isArray(arg)) {
                throw new Error(message || arg + ' should be array');
            }
        }

        function isBoolean(arg, message) {
            if (typeof arg !== 'boolean') {
                throw new Error(message || arg + ' should be boolean');
            }
        }

        function isNotNull(arg, message) {
            if (arg === null) {
                throw new Error(message || arg + ' should be not null');
            }
        }

        function isNumber(arg, message) {
            if (typeof arg !== 'number') {
                throw new Error(message || arg + ' should be number');
            }
        }

        function isString(arg, message) {
            if (typeof arg !== 'string') {
                throw new Error(message || arg + ' should be string');
            }
        }

        function isObject(arg, message) {
            if (typeof arg !== 'object') {
                throw new Error(message || arg + ' should be an object');
            }
        }

        function isDate(d, message) {
            if (typeof d === 'object' && objectToString(d) !== '[object Date]') {
                throw new Error(message || d + ' should be a date');
            }
        }

        function isError(e, message) {
            if (typeof e === 'object' && (objectToString(e) !== '[object Error]' || e instanceof Error)) {
                throw new Error(message || e + ' should be an error');
            }
        }

        function isFunction(arg, message) {
            if (typeof arg !== 'function') {
                throw new Error(message || arg + ' should be a function');
            }
        }

        function isDefined(arg, message) {
           if (typeof arg === "undefined") {
               throw new Error(message || arg + ' should be defined');
           }
        }

        function isEmpty(arg, message) {
            if (arg === null || arg === undefined || arg === false) {
                throw new Error(message || arg + ' should be not null or undefined or false');
            }
        }

        function contains(obj, prop, message) {
            if (typeof obj !== 'object') {
                throw new Error(obj + ' should be an object');
            }
            if (obj[prop] === null || obj[prop] === undefined) {
                throw new Error(message || prop + ' should be in object ' + obj);
            }
        }

        // Compares args with ==
        function equal(actual, expected, message) {
            if (actual != expected) {
                throw new Error(message || actual + ' should be not equal ' + expected);
            }
        }

        // Compares args with !=
        function notEqual(actual, expected, message) {
            if (actual == expected) {
                throw new Error(message || actual + ' should be equal ' + expected);
            }
        }

        // Compares args with ===
        function strictEqual(actual, expected, message) {
            if (actual !== expected) {
                throw new Error(message || actual + ' should not be strict equal ' + expected);
            }
        }

        // Compares args with !==
        function notStrictEqual(actual, expected, message) {
            if (actual === expected) {
                throw new Error(message || actual + ' should not strict equal ' + expected);
            }
        }

        // Checks if value is a valid ObjectId
        function isObjectId(value, message) {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            if (!checkForHexRegExp.test(value)) {
                throw new Error(message || value + ' should be an object id');
            }
        }

    }]);

})();

/**
 * @file Debugging service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipDebug', []);

    thisModule.provider('pipDebug', ['$logProvider', function ($logProvider) {

        this.enabled = true;

        return {
            enable: enable,
            disable: disable,
            enabled: enabled,
            
            $get: ['$log', function($log) {
                return {
                    enabled: enabled,
                    log: $log.log,
                    info: $log.info,
                    warn: $log.warn,
                    error: $log.error,
                    debug: $log.debug
                }
            }]
        };

        function enabled() {
            return this.enabled;
        }

        function enable() {
            this.enabled = true;
            $logProvider.debugEnabled(true);
        }

        function disable() {
            this.enabled = false;
            $logProvider.debugEnabled(false);
        }

    }]);

})();


 /* global angular */

(function () {
    'use strict';

    angular.module('pipScope', ['pipScope.Error', 'pipScope.Transaction']);
    angular.module('pipTransactions', ['pipScope']);

})();
/**
 * @file Error context
 * @description
 * Error context decouples business components that throw errors
 * and visualization components that show them to users
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */
 
(function () {
    'use strict';

    var thisModule = angular.module('pipScope.Error', ['pipAssert']);

    /*
     * Error is designed to assist with error handling
     * within different application scopes & controllers without overlap.
     *
     * A unique identification of the scope/controller is passed to the service
     * when it is initialized to identify the error for that scope.
     * */
    thisModule.factory('pipError',
        ['$rootScope', 'pipAssert', function ($rootScope, pipAssert) {

            // Initialize error scope
            $rootScope.errors = {};

            return createError;

            //----------------------------

            function initError(scope) {
                $rootScope.errors[scope] = {
                    message: undefined,
                    code: undefined,
                    details: undefined
                };
            };

            function errorMessage(error) {
                if (_.isNull(error)) {
                    return null;
                }

                // Process regular messages
                if (error.message) {
                    return error.message;
                }

                // Process server application errors
                if (error.data) {
                    if (error.data.code) {
                        // process server error codes here
                        return 'ERROR_' + error.data.code;
                    }

                    if (error.data.message) {
                        return error.data.message;
                    }
                }

                // Process standard HTTP errors
                if (error.statusText) {
                    return error.statusText;
                }

                if (error.status) {
                    return 'ERROR_' + error.status;
                }
                
                return error.data ? error.data : error;
            };

            function errorCode(error) {
                if (_.isNull(error)) {
                    return null;
                }

                if (error.data && error.data.code) {
                    return error.data.code;
                }

                if (error.status) {
                    return error.status;
                }
                
                return null;
            };

            function errorDetails(error) {
                return error && error.data ? error.data : error;
            };

            function createError(scope, scopeObject) {
                scope = scope || 'global';

                var error = {
                    reset: function () {
                        initError(scope);
                    },

                    empty: function() {
                        var error = $rootScope.errors[scope];
                        return _.isNull(error) || (_.isNull(error.message) && _.isNull(error.code));
                    },

                    get: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope];
                        }
                        return '';
                    },

                    message: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].message;
                        }
                        return null;
                    },

                    code: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].code;
                        }
                        return null;
                    },

                    details: function () {
                        if ($rootScope.errors[scope]) {
                            return $rootScope.errors[scope].details;
                        }
                        return null;
                    },

                    set: function (error) {
                        if (error) {
                            pipAssert.isObject(error, "Setting error: error should be an object");

                            $rootScope.errors[scope] = {
                                message: errorMessage(error),
                                code: errorCode(error),
                                details: errorDetails(error)
                            };
                            console.error($rootScope.errors[scope]);
                        } else {
                            initError(scope);
                        }
                    }
                };

                // Assign error into scope
                if (_.isObject(scopeObject)) scopeObject.error = error;

                return error;
            };
        }]
    );
    
})();
/**
 * @file Transaction context
 * @description
 * Transaction context helps to wrap multiple server requests
 * into one logical transaction. It decouples transaction
 * management and progress visualization to the user
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipScope.Transaction', ['pipTranslate', 'pipScope.Error']);

	thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {
        
        pipTranslateProvider.translations('en', {
            'ENTERING': 'Entering...',
            'PROCESSING': 'Processing...',
            'LOADING': 'Loading...',
            'SAVING': 'Saving...'
        });

        pipTranslateProvider.translations('ru', {
            'ENTERING': 'Вход в систему...',
            'PROCESSING': 'Обрабатывается...',
            'LOADING': 'Загружается...',
            'SAVING': 'Сохраняется...'
        });
		
	}]);

    /*
     * Transaction is designed to assist with transaction processing
     * within different application scopes & controllers without overlap.
     *
     * A unique identification of the scope/controller is passed to the service
     * when it is initialized to identify the error for that scope.
     * 
     * Transaction is also integrated with Error service. So you don't need to double it
     * */
    thisModule.factory('pipTransaction',
        ['$rootScope', 'pipError', function ($rootScope, pipError) {

            // Initialize transaction scope
            $rootScope.transactions = {};

            return createTransaction;

            //---------------------------------

            function initTransaction(scope) {
                $rootScope.transactions[scope] = {
                    id: undefined,
                    operation: undefined
                };
            }
            
            function createTransaction(scope, scopeObject) {
                scope = scope || 'global';

                var error = pipError(scope);
                var transaction = {
                    error: error,

                    reset: function () {
                        initTransaction();
                        error.reset();
                    },

                    busy: function() {
                        var transaction = $rootScope.transactions[scope];
                        return transaction != null && transaction.id;
                    },

                    failed: function() {
                        return !error.empty();
                    },

                    aborted: function(id) {
                        var transaction = $rootScope.transactions[scope];
                        return _.isNull(transaction) || transaction.id != id;
                    },

                    get: function () {
                        if (_.isNull($rootScope.transactions[scope])) {
                            initTransaction(scope);
                        }
                        return $rootScope.transactions[scope];
                    },

                    id: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction ? transaction.id : null;
                    },

                    operation: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction ? transaction.operation : null;
                    },

                    errorMessage: function () {
                        return error.message();
                    },

                    begin: function (operation) {
                        var transaction = $rootScope.transactions[scope];
                        // Transaction already in progress
                        if (transaction != null && transaction.id) {
                            return null;
                        }                      

                        transaction = $rootScope.transactions[scope] = {
                            id: new Date().getTime(),
                            operation: operation || 'PROCESSING'
                        };
                        error.reset();

                        return transaction.id;
                    },

                    abort: function() {
                        var transaction = $rootScope.transactions[scope];
                        if (transaction) {
                            transaction.id = null;
                        }
                        error.reset();
                    },

                    end: function (err) {
                        if (err) error.set(err);
                        else error.reset();

                        var transaction = $rootScope.transactions[scope];
                        if (transaction != null) {
                            transaction.id = null;
                        }                      
                    }
                };

                if (_.isObject(scopeObject)) {
                    scopeObject.error = error;
                    scopeObject.transaction = transaction;
                }

                return transaction;
            }
        }]
    );

})();

/**
 * @file Application router extended from ui.router
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */
 
(function () {
    'use strict';
    
    var thisModule = angular.module('pipState', ['ui.router', 'pipTranslate', 'pipAssert']);

    thisModule.config(
        ['$locationProvider', '$httpProvider', 'pipTranslateProvider', function($locationProvider, $httpProvider, pipTranslateProvider) {
            // Switch to HTML5 routing mode
            //$locationProvider.html5Mode(true);
            pipTranslateProvider.translations('en', {
                'ERROR_SWITCHING': 'Error while switching route. Try again.'
            });

            pipTranslateProvider.translations('ru', {
                'ERROR_SWITCHING': 'Ошибка при переходе. Попробуйте ещё раз.'
            });
        }]
    );

    thisModule.run(
        ['$rootScope', 'pipTranslate', '$state', function($rootScope, pipTranslate, $state) {
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

        }]
    );

    thisModule.provider('pipState', ['$stateProvider', 'pipAssertProvider', function($stateProvider, pipAssertProvider) {
        // Configuration of redirected states
        var redirectedStates = {};

        this.redirect = setRedirect;
        this.state = $stateProvider.state;

        this.$get = ['$state', '$timeout', 'pipAssert', function ($state, $timeout, pipAssert) {
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
        }];

        return;        
        //------------------

        // Specify automatic redirect from one state to another
        function setRedirect(fromState, toState) {
            pipAssertProvider.isNotNull(fromState, "pipState.redirect: fromState cannot be null");
            pipAssertProvider.isNotNull(toState, "pipState.redirect: toState cannot be null");
            
            redirectedStates[fromState] = toState;  

            return this;
        };

    }]);

})();
/**
 * @file Identity service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipIdentity', []);

    thisModule.provider('pipIdentity', ['$timeout', 'pipAssertProvider', function($timeout, pipAssertProvider) {
        var 
            setRoot = true,
            identity = null;

        this.setRoot = initSetRoot;
        this.identity = initIdentity;

        this.$get = ['$rootScope', 'pipAssert', function ($rootScope, pipAssert) {
            // Set root variable
            if (setRoot)
                $rootScope.$identity = identity;

            function getIdentity() {
                return identity;
            }

            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function setIdentity(newIdentity, fullReset, partialReset) {
                if (newIdentity != null)
                    pipAssert.isObject(newIdentity || '', "pipIdentity.set: argument should be an object");

                identity = newIdentity;

                if (setRoot)
                    $rootScope.$identity = identity;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipIdentityChanged', identity);
            }

            return {
                get: getIdentity,
                set: setIdentity,
            }
        }];

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipIdentityProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Initialize identity
        function initIdentity(newIdentity) {
            if (newIdentity != null) {
                pipAssertProvider.isObject(newIdentity || '', "pipIdentityProvider.identity: argument should be an object");
                identity = newIdentity;
            }
            return identity;  
        }

    }]);

})();
/**
 * @file Session service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSession', []);

    thisModule.provider('pipSession', ['$timeout', 'pipAssertProvider', function($timeout, pipAssertProvider) {
        var 
            setRoot = true,
            session = null;

        this.setRoot = initSetRoot;
        this.session = initSession;

        this.$get = ['$rootScope', 'pipAssert', function ($rootScope, pipAssert) {
            // Set root variable
            if (setRoot)
                $rootScope.$session = session;
            
            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function openSession(newSession, fullReset, partialReset) {
                pipAssert.isObject(newSession || '', "pipSession.open: argument should be an object");

                session = newSession;

                if (setRoot)
                    $rootScope.$session = session;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionOpened', session);
            }

            function closeSession(fullReset, partialReset) {
                var oldSession = session;
                session = null;

                if (setRoot)
                    $rootScope.$session = session;

                resetContent(fullReset, partialReset);

                $rootScope.$broadcast('pipSessionClosed', oldSession);
            }

            function getSession() {
                return session;
            }

            return {
                get: getSession,
                open: openSession,
                close: closeSession
            }
        }];

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipSessionProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Initialize session
        function initSession(newSession) {
            if (newSession != null) {
                pipAssertProvider.isObject(newSession || '', "pipSessionProvider.session: argument should be an object");
                session = newSession;
            }
            return session;  
        }

    }]);

})();
/**
 * @file Global application timer service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTimer', []);

    thisModule.service('pipTimer', 
        ['$interval', '$rootScope', function ($interval, $rootScope) {
            var 
                AUTO_PULL_CHANGES_TIMEOUT = 60000, // 1 min
                AUTO_UPDATE_PAGE_TIMEOUT = 15000,  // 15 sec
                AUTO_UPDATE_COLLECTION_TIMEOUT = 300000, // 5 min
                started = false, 
                autoPullChangesInterval, 
                autoUpdatePageInterval,
                autoUpdateCollectionInterval;

            return {
                isStarted: isStarted,
                start: start,
                stop: stop
            };

            //------------------------

            function isStarted() {
                return started;
            };

            function start() {
                if (started) return;

                autoPullChangesInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoPullChanges');
                }, AUTO_PULL_CHANGES_TIMEOUT);

                autoUpdatePageInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdatePage');
                }, AUTO_UPDATE_PAGE_TIMEOUT);

                autoUpdateCollectionInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdateCollection');
                }, AUTO_UPDATE_COLLECTION_TIMEOUT);

                started = true;
            };

            function stop() {
                if (autoPullChangesInterval)
                    $interval.cancel(autoPullChangesInterval);

                if (autoUpdatePageInterval)
                    $interval.cancel(autoUpdatePageInterval);

                if (autoUpdateCollectionInterval)
                    $interval.cancel(autoUpdatePageInterval);

                started = false;
            };
        }]
    );

})();

/**
 * @file Translatation service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate', ['pipTranslate.Service', 'pipTranslate.Directive', 'pipTranslate.Filter']);

})();
/**
 * @file Translatation directives
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Directive', ['pipTranslate.Service']);

    thisModule.directive('pipTranslate', ['pipTranslate', function(pipTranslate) {
        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslate',
                key2: '@key'
            },
            link: function (scope, element, attrs) {
                var key = scope.key1 || scope.key2;
                var value = pipTranslate.translate(key);
                element.text(value);
            }

        };
    }]);

    thisModule.directive('pipTranslateHtml', ['pipTranslate', function(pipTranslate) {
        return {
            restrict: 'EA',
            scope: {
                key1: '@pipTranslateHtml',
                key2: '@key'
            },
            link: function (scope, element, attrs) {
                var key = scope.key1 || scope.key2;
                var value = pipTranslate.translate(key);
                element.html(value);
            }

        };
    }]);

})();
/**
 * @file Filter to translate string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Filter', ['pipTranslate.Service']);

    thisModule.filter('translate', ['pipTranslate', function (pipTranslate) {
        return function (key) {
            return pipTranslate.translate(key) || key;
        }
    }]);

    // thisModule.filter('optionalTranslate', function ($injector) {
    //     var pipTranslate = $injector.has('pipTranslate') 
    //         ? $injector.get('pipTranslate') : null;

    //     return function (key) {
    //         return pipTranslate  ? pipTranslate.translate(key) || key : key;
    //     }
    // });

})();

/**
 * @file Translatation service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Service', ['LocalStorageModule', 'pipAssert']);

    thisModule.provider('pipTranslate', ['pipAssertProvider', function(pipAssertProvider) {
        var 
            language = 'en',
            persist = true,
            setRoot = true,
            translationMap = {
                en: {
                    'en': 'English',
                    'ru': 'Russian',
                    'es': 'Spanish',
                    'pt': 'Portuguese',
                    'de': 'German',
                    'fr': 'French'
                },
                ru: {
                    'en': 'Английский',
                    'ru': 'Русский',
                    'es': 'Испанский',
                    'pt': 'Португальский',
                    'de': 'Немецкий',
                    'fr': 'Французский'
                }
            };

        this.translations = setTranslations;
        this.language = initLanguage;
        this.use = initLanguage;
        this.persist = initPersist;
        this.setRoot = initSetRoot;

        this.$get = ['$rootScope', '$timeout', 'localStorageService', 'pipAssert', function ($rootScope, $timeout, localStorageService, pipAssert) {
            // Read language from persistent storage
            if (persist)
                language = localStorageService.get('language') || language;

            // Set root variable
            if (setRoot) 
                $rootScope.$language = language;
            
            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function setLanguage(newLanguage, fullReset, partialReset) {
                pipAssert.isString(newLanguage || '', "pipTranslate.use: argument should be a string");

                if (newLanguage != null && newLanguage != language) {
                    language = newLanguage;
                    
                    if (persist)
                        localStorageService.set('language', language);
                    if (setRoot)
                        $rootScope.$language = language;
                    
                    // Resetting content.
                    resetContent(fullReset, partialReset);

                    // Sending notification
                    $rootScope.$broadcast('pipLanguageChanged', newLanguage);
                }
                return language;
            }

            return {
                use: setLanguage,

                translations: setTranslations,
                translate: translate,
                translateArray: translateArray,
                translateSet: translateSet,
                translateObjects: translateObjects,
                translateById: translateById,
                translateSetById: translateSetById,
                translateStringsSet: translateStringsSet
            }
        }];

        // Initialize language selection
        function initLanguage(newLanguage) {
            pipAssertProvider.isString(newLanguage || '', "pipTranslateProvider.use or pipTranslateProvider.language: argument should be a string");

            if (newLanguage != null) {
                language = newLanguage;
            }
            return language;
        }

        // Initialize persistence flag
        function initPersist(newPersist) {
            if (newPersist != null) {
                pipAssertProvider.isBoolean(newPersist || '', "pipTranslateProvider.persist: argument should be a boolean");
                persist = newPersist;
            }
            return persist;
        }

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipTranslateProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Set translation strings for specific language
        function setTranslations(language, languageMap) {
            pipAssertProvider.isString(language, "pipTranslate.setTranslations or pipTranslateProvider.translations: first argument should be a string");
            pipAssertProvider.isObject(languageMap, "pipTranslate.setTranslations or pipTranslateProvider.translations: second argument should be an object");

            var map = translationMap[language] || {};
            translationMap[language] = _.extend(map, languageMap);
        }

        // Translate a string by key using set language
        function translate(key) {
            if (_.isNull(key) || _.isUndefined(key)) return '';

            var map = translationMap[language] || {};
            return map[key] || key;
        }

        // Translate an array of strings
        function translateArray(keys) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateArray: argument should be an array");

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var key = k || '';
                values.push(map[key] || key);
            });

            return values;
        }

        // Translate an array of strings into array of objects (set)
        function translateSet(keys, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSet: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSet: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSet: third argument should be a string");

            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate a collection of objects
        function translateObjects(items, key, value) {
            if (_.isNull(items) || items.length == 0) return [];

            pipAssertProvider.isArray(items, "pipTranslate.translateObjects: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateObjects: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateObjects: third argument should be a string");

            key = key || 'name';
            value = value || 'nameLocal';

            var map = translationMap[language] || {};

            _.each(items, function (i) {
                var item = i, mapKey = item[key] || '';

                item[value] = map[mapKey] || mapKey;
            });

            return items;
        }

        // Translate a string by key  with prefix using set language todo
        function translateById(prefix, key) {
            pipAssertProvider.isString(key || '', "pipTranslate.translateById: second argument should be a string");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateById: first argument should be a string");

            prefix = prefix ? prefix + '_' : '';
            key = (prefix + key).replace(/ /g, '_').toUpperCase();
            if (key == null) return '';
            var map = translationMap[language] || {};
            return map[key] || key;
        };

        function translateSetById(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSetById: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateSetById: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSetById: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSetById: forth argument should be a string");

            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() : '';
            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[prefix + '_' + mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate an array of strings, apply uppercase and replace ' ' => '_'
        function translateStringsSet(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateStringsSet: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateStringsSet: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateStringsSet: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateStringsSet: forth argument should be a string");

            key = key || 'id';
            value = value || 'name';
            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() + '_': '';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';
                obj[key] = mapKey;
                obj[value] = map[prefix + mapKey.replace(/ /g, '_').toUpperCase()]
                    || (prefix + mapKey.replace(/ /g, '_').toUpperCase());

                values.push(obj);
            });

            return values;
        }
    }]);

})();
/**
 * @file Code utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipCodes', []);

    thisModule.factory('pipCodes', function () {
        
        return {
            hash: hash,
            verification: verification
        }
    
        // Simple version of string hashcode
        function hash(value) {
            if (value == null) return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
        }

        // Generates random big number for verification codes
        function verification() {
            return Math.random().toString(36).substr(2, 10).toUpperCase(); // remove `0.`
        }

    });

})();
/**
 * @file Collection utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

// Todo: Deprecate
(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.Collections', []);

    thisModule.factory('pipCollections', function () {
        var collections = {};

        // Index of element in array by key
        collections.indexBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    return i;
                }
            }
            return null;
        };
    
        // Find element in array by key
        collections.findBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    return items[i];
                }
            }
            return null;
        };
    
        // Remove element from array by value
        collections.remove = function (items, item) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i] == item) {
                    items.splice(i, 1);
                    i--;
                }
            }
        };
    
        // Removes element from array by key
        collections.removeBy = function (items, key, value) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items.splice(i, 1);
                    i--;
                }
            }
        };
    
        // Replaced element by key
        collections.replaceBy = function (items, key, value, data) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items[i] = data;
                    return;
                }
            }
        };
    
        // Calculate difference between two collections
        collections.difference = function (a1, a2, comparator) {
            var result = [];
    
            _.each(a1, function (e1) {
                var e2 = _.find(a2, function (e) {
                    return comparator(e1, e);
                });
    
                if (e2 == null) {
                    result.push(e1);
                }
            })
    
            return result;
        };

        return collections;
    });

})();

/**
 * @file String formatting service
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipFormat', []);

    thisModule.factory('pipFormat', function () {

        // Creates a sample line from a text
        function sample(value, maxLength) {
            if (!value || value == '') return '';

            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;

            return value.substring(0, length);
        }

        function sprintf() {
            function get_type(variable) {
                return toString.call(variable).slice(8, -1).toLowerCase();
            }

            var str_repeat = strRepeat;

            var str_format = function() {
                if (!str_format.cache.hasOwnProperty(arguments[0])) {
                    str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                }
                return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };

            str_format.format = function(parse_tree, argv) {
                var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
                for (i = 0; i < tree_length; i++) {
                    node_type = get_type(parse_tree[i]);
                    if (node_type === 'string') {
                        output.push(parse_tree[i]);
                    }
                    else if (node_type === 'array') {
                        match = parse_tree[i]; // convenience purposes only
                        if (match[2]) { // keyword argument
                            arg = argv[cursor];
                            for (k = 0; k < match[2].length; k++) {
                                if (!arg.hasOwnProperty(match[2][k])) {
                                    throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
                                }
                                arg = arg[match[2][k]];
                            }
                        } else if (match[1]) { // positional argument (explicit)
                            arg = argv[match[1]];
                        }
                        else { // positional argument (implicit)
                            arg = argv[cursor++];
                        }

                        if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
                        }
                        switch (match[8]) {
                            case 'b': arg = arg.toString(2); break;
                            case 'c': arg = String.fromCharCode(arg); break;
                            case 'd': arg = parseInt(arg, 10); break;
                            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
                            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
                            case 'o': arg = arg.toString(8); break;
                            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
                            case 'u': arg = Math.abs(arg); break;
                            case 'x': arg = arg.toString(16); break;
                            case 'X': arg = arg.toString(16).toUpperCase(); break;
                        }
                        arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
                        pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                        pad_length = match[6] - String(arg).length;
                        pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                        output.push(match[5] ? arg + pad : pad + arg);
                    }
                }
                return output.join('');
            };

            str_format.cache = {};

            str_format.parse = function(fmt) {
                var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
                while (_fmt) {
                    if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
                        parse_tree.push(match[0]);
                    }
                    else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
                        parse_tree.push('%');
                    }
                    else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
                        if (match[2]) {
                            arg_names |= 1;
                            var field_list = [], replacement_field = match[2], field_match = [];
                            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1]);
                                while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                                    if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                                        field_list.push(field_match[1]);
                                    }
                                    else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                                        field_list.push(field_match[1]);
                                    }
                                    else {
                                        throw new Error('[_.sprintf] huh?');
                                    }
                                }
                            }
                            else {
                                throw new Error('[_.sprintf] huh?');
                            }
                            match[2] = field_list;
                        }
                        else {
                            arg_names |= 2;
                        }
                        if (arg_names === 3) {
                            throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
                        }
                        parse_tree.push(match);
                    }
                    else {
                        throw new Error('[_.sprintf] huh?');
                    }
                    _fmt = _fmt.substring(match[0].length);
                }
                return parse_tree;
            };

            return str_format;
        }

        // Return function as the service
        result = sprintf;
        result.sample = sample;
        result.format = sprintf;
        result.sprintf = sprintf;

        return result;
    });

})();

/**
 * @file General purpose utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUtils.General', ['pipState', 'pipAssert']);

    thisModule.factory('pipUtils', ['$rootScope', '$window', '$state', 'pipAssert', function ($rootScope, $window, $state, pipAssert) {

        function strRepeat(str, qty) {
            if (qty < 1) return '';
            var result = '';
            while (qty > 0) {
                if (qty & 1) result += str;
                qty >>= 1, str += str;
            }
            return result;
        }

        var toString = Object.prototype.toString;

        return {
            copyProperty: copyProperty,
            copy: copyProperty,
            swapProperties: swapProperties,
            swap: swapProperties,
            convertToBoolean: convertToBoolean,
            toBoolean: convertToBoolean,
            toBool: convertToBoolean,
            convertObjectIdsToString: convertObjectIdsToString,
            OidToString: convertObjectIdsToString,
            generateVerificationCode: generateVerificationCode,
            vercode: generateVerificationCode,
            equalObjectIds: equalObjectIds,
            eqOid: equalObjectIds,
            notEqualObjectIds: notEqualObjectIds,
            neqOid: notEqualObjectIds,
            containsObjectId: containsObjectId,
            hasOid: containsObjectId,
            isObjectId: isObjectId,
            // Strings functions. No analogues in lodash.strings
            hashCode: hashCode,
            makeString: makeString,
            // Collection function. No analogues in lodash. It may be in lodash later. Look gitHub/lodash issue #1022
            replaceBy: replaceBy
        };
        
        //--------------------
        function replaceBy(items, key, value, data) {
            if (!items || !items.length)
                return null;
            for (var i = 0; i < items.length; i++) {
                if (items[i][key] == value) {
                    items[i] = data;
                    return;
                }
            }
        };

        // Ensure some object is a coerced to a string
        function makeString(object) {
            if (object == null) return '';
            return '' + object;
        };

        function isObjectId(value) {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
            return checkForHexRegExp.test(value);
        }

        // Compares two ObjectIds (they are not equal by '==')
        function equalObjectIds(value1, value2) {
            if (value1 == null && value2 == null)
                return true;

            if (value1 == null || value2 == null)
                return false;

            return value1.toString() == value2.toString();
        };

        // Compares two ObjectIds (they are always not equal by '!=')
        function notEqualObjectIds(value1, value2) {
            if (value1 == null && value2 == null)
                return false;

            if (value1 == null || value2 == null)
                return true;

            return value1.toString() != value2.toString();
        };

        // Checks if array contains concrete objectId
        function containsObjectId(values, value) {
            return _.some(values, function (value1) {
                return equalObjectIds(value1, value);
            });
        };

        // Copy property from one object to another if it exists (not null)
        function copyProperty(dest, destProperty, orig, origProperty) {
            // Shift if only 3 arguments set
            if (_.isObject(destProperty)
                && typeof (origProperty) == 'undefined') {
                origProperty = orig;
                orig = destProperty;
                destProperty = origProperty;
            }
    
            if (orig[origProperty] || (typeof (orig[origProperty]) === 'number' && orig[origProperty] % 1 == 0)) {
                dest[destProperty] = orig[origProperty];
                return true;
            }
    
            return false;
        };
    
        // Swaps values of two properties
        function swapProperties(obj, prop1, prop2) {
            var 
                temp1 = obj[prop1],
                temp2 = obj[prop2];
    
            if (temp1) {
                obj[prop2] = temp1;
            }
            else {
                delete obj[prop2];
            }
    
            if (temp2) {
                obj[prop1] = temp2;
            }
            else {
                delete obj[prop1];
            }
        };
    
        // Converts value into boolean
        function convertToBoolean(value) {
            if (value == null) return false;
            if (!value) return false;
            value = value.toString().toLowerCase();
            return value == '1' || value == 'true';
        };
    
        // Converts array of object ids to strings (for comparison)
        function convertObjectIdsToString(values) {
            return _.map(values, function (value) {
                return value ? value.toString() : 0;
            });
        };


    }]);

})();

/**
 * @file Page scrolling functions
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipScroll', []);

    thisModule.factory('pipScroll', function () {
        return {
            scrollTo: scrollTo
        };
        
        //-------------------------------------

        function scrollTo(parentElement, childElement, animationDuration) {
            if(!parentElement || !childElement) return;
            if (animationDuration == undefined) animationDuration = 300;

            setTimeout(function () {
                if (!$(childElement).position()) return;
                var modDiff= Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                if (modDiff < 20) return;
                var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                if (animationDuration > 0)
                    $(parentElement).animate({
                        scrollTop: scrollTo + 'px'
                    }, animationDuration);
            }, 100);
        }

    });

})();

/**
 * @file System Information services
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipSystemInfo', []);

    thisModule.factory('pipSystemInfo', ['$rootScope', '$window', function ($rootScope, $window) {

        return {
            getBrowserName: getBrowserName,
            getBrowserVersion: getBrowserVersion,
            getPlatform: getPlatform,
            isDesktop: isDesktop,
            isMobile: isMobile,
            isCordova: isCordova,
            getOS: getOS,            
            isSupported: isSupported
        };

        // todo add support for iPhone
        function getBrowserName() {
            var ua = $window.navigator.userAgent;

            if (ua.search(/Edge/) > -1) return "edge";
            if (ua.search(/MSIE/) > -1) return "ie";
            if (ua.search(/Trident/) > -1) return "ie";
            if (ua.search(/Firefox/) > -1) return "firefox";
            if (ua.search(/Opera/) > -1) return "opera";
            if (ua.search(/OPR/) > -1) return "opera";
            if (ua.search(/YaBrowser/) > -1) return "yabrowser";
            if (ua.search(/Chrome/) > -1) return "chrome";
            if (ua.search(/Safari/) > -1) return "safari";
            if (ua.search(/Maxthon/) > -1) return "maxthon";
            
            return "unknown";
        }

        function getBrowserVersion() {
            var browser, version;
            var ua = $window.navigator.userAgent;

            if (ua.search(/Edge/) > -1) browser = "edge";
            if (ua.search(/MSIE/) > -1) browser = "ie";
            if (ua.search(/Trident/) > -1) browser = "ie11";
            if (ua.search(/Firefox/) > -1) browser = "firefox";
            if (ua.search(/Opera/) > -1) browser = "opera";
            if (ua.search(/OPR/) > -1) browser = "operaWebkit";
            if (ua.search(/YaBrowser/) > -1) browser = "yabrowser";
            if (ua.search(/Chrome/) > -1) browser = "chrome";
            if (ua.search(/Safari/) > -1) browser = "safari";
            if (ua.search(/Maxthon/) > -1) browser = "maxthon";

            switch (browser) {
                case "edge":
                    version = (ua.split("Edge")[1]).split("/")[1];
                    break;
                case "ie":
                    version = (ua.split("MSIE ")[1]).split(";")[0];
                    break;
                case "ie11":
                    browser = "ie";
                    version = (ua.split("; rv:")[1]).split(")")[0];
                    break;
                case "firefox":
                    version = ua.split("Firefox/")[1];
                    break;
                case "opera":
                    version = ua.split("Version/")[1];
                    break;
                case "operaWebkit":
                    version = ua.split("OPR/")[1];
                    break;
                case "yabrowser":
                    version = (ua.split("YaBrowser/")[1]).split(" ")[0];
                    break;
                case "chrome":
                    version = (ua.split("Chrome/")[1]).split(" ")[0];
                    break;
                case "safari":
                    version = (ua.split("Version/")[1]).split(" ")[0];
                    break;
                case "maxthon":
                    version = ua.split("Maxthon/")[1];
                    break;
            }

            return version;
        }
        
        function getPlatform() {
            var ua = $window.navigator.userAgent;

            if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase())) 
                return 'mobile';

            return 'desktop';
        }

        function isDesktop() {
            return getPlatform() == 'desktop';
        }

        function isMobile() {
            return getPlatform() == 'mobile';
        }

        // Todo: complete implementation
        function isCordova() {
            return null;
        }

        function getOS() {
            var ua = $window.navigator.userAgent;

            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [u])[0].replace('sunos', 'solaris'),
                osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            } catch (err) {
                return 'unknown'
            }
        }

        // Todo: Move to errors
        function isSupported(supported) {
            if (!supported) supported = {
                edge: 11,
                ie: 11,
                firefox: 43, //4, for testing
                opera: 35,
                chrome: 47
            };

            var browser = getBrowserName();
            var version = getBrowserVersion();
            version = version.split(".")[0]

            if (browser && supported[browser] && version >= supported[browser]) 
                return true;

            return true;
        };

    }]);

})();

/**
 * @file Search tag utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTags', []);

    thisModule.factory('pipTags', function () {
            
        return {
            equal: equal,
            normalizeOne: normalizeOne,
            normalizeAll: normalizeAll,
            normalize: normalizeAll,
            compressOne: compressOne,
            compressAll: compressAll,
            compress: compressAll,
            extract: extract
        };

        //------------------------------

        function normalizeOne(tag) {
            return tag 
                ? _.trim(tag.replace(/(_|#)+/g, ' '))
                : null;
        }
    
        function compressOne(tag) {
            return tag
                ? tag.replace(/( |_|#)/g, '').toLowerCase()
                : null;
        }
    
        function equal(tag1, tag2) {
            if (tag1 == null && tag2 == null)
                return true;
            if (tag1 == null || tag2 == null)
                return false;
            return compressOne(tag1) == compressOne(tag2);
        }
    
        function normalizeAll(tags) {
            if (_.isString(tags)) {
                tags = tags.split(/( |,|;)+/);
            }
    
            tags = _.map(tags, function (tag) {
                return normalizeOne(tag);
            });
    
            return tags;
        }
    
        function compressAll(tags) {
            if (_.isString(tags))
                tags = tags.split(/( |,|;)+/);
    
            tags = _.map(tags, function (tag) {
                return compressOne(tag);
            });
    
            return tags;
        };
    
        function extract(entity, searchFields) {
            var tags = normalizeAll(entity.tags);
    
            _.each(searchFields, function (field) {
                var text = entity[field] || '';
    
                if (text != '') {
                    var hashTags = text.match(/#\w+/g);
                    tags = tags.concat(normalizeAll(hashTags));
                }
            });
    
            return _.uniq(tags);
        }
    });

})();

/**
 * @file Collection of utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    angular.module('pipUtils', 
		['pipUtils.General', 'pipUtils.Strings', 'pipUtils.Collections']);
})();

//# sourceMappingURL=pip-webui-services.js.map
