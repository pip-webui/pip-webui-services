(function () {
    'use strict';
    angular.module('pipServices', [
        'pipScope',
        'pipTranslate',
        'pipRouting',
        'pipTimer',
        'pipSession',
        'pipIdentity',
        'pipSystemInfo',
        'pipFormat',
        'pipScroll',
        'pipPageReset',
        'pipTags'
    ]);
})();





var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        captureStateTranslations.$inject = ['$rootScope'];
        decorateBackStateService.$inject = ['$delegate', '$window'];
        addBackStateDecorator.$inject = ['$provide'];
        function captureStateTranslations($rootScope) {
            "ngInject";
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
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
            });
        }
        function decorateBackStateService($delegate, $window) {
            "ngInject";
            $delegate.goBack = goBack;
            $delegate.goBackAndSelect = goBackAndSelect;
            return $delegate;
            function goBack() {
                $window.history.back();
            }
            function goBackAndSelect(params) {
                if (pip.routing.PreviousState != null
                    && pip.routing.PreviousState.name != null) {
                    var state = _.cloneDeep(pip.routing.PreviousState);
                    state.params = _.extend(state.params, params);
                    $delegate.go(state.name, state.params);
                }
                else {
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
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        decorateRedirectStateProvider.$inject = ['$delegate'];
        addRedirectStateProviderDecorator.$inject = ['$provide'];
        decorateRedirectStateService.$inject = ['$delegate', '$timeout'];
        addRedirectStateDecorator.$inject = ['$provide'];
        routing.RedirectedStates = {};
        function decorateRedirectStateProvider($delegate) {
            "ngInject";
            $delegate.redirect = redirect;
            return $delegate;
            function redirect(fromState, toState) {
                pip.routing.RedirectedStates[fromState] = toState;
                return this;
            }
        }
        function addRedirectStateProviderDecorator($provide) {
            "ngInject";
            $provide.decorator('$state', decorateRedirectStateProvider);
        }
        function decorateRedirectStateService($delegate, $timeout) {
            "ngInject";
            $delegate.redirect = redirect;
            return $delegate;
            function redirect(event, state, params) {
                var toState = pip.routing.RedirectedStates[state.name];
                if (_.isFunction(toState)) {
                    toState = toState(state.name, params);
                    if (_.isNull(toState))
                        throw new Error('Redirected toState cannot be null');
                }
                if (!!toState) {
                    $timeout(function () {
                        event.preventDefault();
                        $delegate.transitionTo(toState, params, { location: 'replace' });
                    });
                    return true;
                }
                return false;
            }
        }
        function addRedirectStateDecorator($provide) {
            "ngInject";
            $provide.decorator('$state', decorateRedirectStateService);
        }
        angular
            .module('pipRouting.Redirect', ['ui.router'])
            .config(addRedirectStateProviderDecorator)
            .config(addRedirectStateDecorator);
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        angular.module('pipRouting', [
            'ui.router', 'pipRouting.Events', 'pipRouting.Back', 'pipRouting.Redirect'
        ]);
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var routing;
    (function (routing) {
        'use strict';
        hookRoutingEvents.$inject = ['$log', '$rootScope', '$state'];
        routing.RoutingVar = "$routing";
        function hookRoutingEvents($log, $rootScope, $state) {
            "ngInject";
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                $rootScope[routing.RoutingVar] = true;
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $rootScope[routing.RoutingVar] = false;
            });
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                $rootScope[routing.RoutingVar] = false;
                $log.error('Error while switching route to ' + toState.name);
                $log.error(error);
                console.error('Error while switching route to ' + toState.name);
                console.error(error);
            });
            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                event.preventDefault();
                $rootScope[routing.RoutingVar] = false;
                $state.go('errors_missing_route', {
                    unfoundState: unfoundState,
                    fromState: {
                        to: fromState ? fromState.name : '',
                        fromParams: fromParams
                    }
                });
            });
        }
        angular
            .module('pipRouting.Events', [])
            .run(hookRoutingEvents);
    })(routing = pip.routing || (pip.routing = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var session;
    (function (session) {
        'use strict';
        session.IdentityRootVar = "$identity";
        session.IdentityChangedEvent = "pipIdentityChanged";
        var IdentityService = (function () {
            function IdentityService(setRootVar, identity, $rootScope) {
                this._setRootVar = setRootVar;
                this._identity = identity;
                this._rootScope = $rootScope;
                this.setRootVar();
            }
            IdentityService.prototype.setRootVar = function () {
                if (this._setRootVar)
                    this._rootScope[pip.session.IdentityRootVar] = this._identity;
            };
            Object.defineProperty(IdentityService.prototype, "identity", {
                get: function () {
                    return this._identity;
                },
                set: function (value) {
                    this._identity = value;
                    this.setRootVar();
                    this._rootScope.$broadcast(pip.session.IdentityChangedEvent, this._identity);
                },
                enumerable: true,
                configurable: true
            });
            return IdentityService;
        }());
        var IdentityProvider = (function () {
            function IdentityProvider() {
                this._setRootVar = true;
                this._identity = null;
                this._service = null;
            }
            Object.defineProperty(IdentityProvider.prototype, "setRootVar", {
                get: function () {
                    return this._setRootVar;
                },
                set: function (value) {
                    this._setRootVar = !!value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(IdentityProvider.prototype, "identity", {
                get: function () {
                    return this._identity;
                },
                set: function (value) {
                    this._identity = value;
                },
                enumerable: true,
                configurable: true
            });
            IdentityProvider.prototype.$get = ['$rootScope', function ($rootScope) {
                "ngInject";
                if (this._service == null)
                    this._service = new IdentityService(this._setRootVar, this._identity, $rootScope);
                return this._service;
            }];
            return IdentityProvider;
        }());
        angular
            .module('pipIdentity', [])
            .provider('pipIdentity', IdentityProvider);
    })(session = pip.session || (pip.session = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var session;
    (function (session_1) {
        'use strict';
        session_1.SessionRootVar = "$session";
        session_1.SessionOpenedEvent = "pipSessionOpened";
        session_1.SessionClosedEvent = "pipSessionClosed";
        var SessionService = (function () {
            function SessionService(setRootVar, session, $rootScope) {
                this._setRootVar = setRootVar;
                this._session = session;
                this._rootScope = $rootScope;
                this.setRootVar();
            }
            SessionService.prototype.setRootVar = function () {
                if (this._setRootVar)
                    this._rootScope[pip.session.SessionRootVar] = this._session;
            };
            Object.defineProperty(SessionService.prototype, "session", {
                get: function () {
                    return this._session;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionService.prototype, "isOpened", {
                get: function () {
                    return this._session != null;
                },
                enumerable: true,
                configurable: true
            });
            SessionService.prototype.open = function (session, fullReset, partialReset) {
                if (fullReset === void 0) { fullReset = false; }
                if (partialReset === void 0) { partialReset = false; }
                if (session == null)
                    throw new Error("Session cannot be null");
                this._session = session;
                this.setRootVar();
                this._rootScope.$broadcast(pip.session.SessionOpenedEvent, session);
            };
            SessionService.prototype.close = function (fullReset, partialReset) {
                if (fullReset === void 0) { fullReset = false; }
                if (partialReset === void 0) { partialReset = false; }
                var oldSession = this._session;
                this._session = null;
                this.setRootVar();
                this._rootScope.$broadcast(pip.session.SessionClosedEvent, oldSession);
            };
            return SessionService;
        }());
        var SessionProvider = (function () {
            function SessionProvider() {
                this._setRootVar = true;
                this._session = null;
                this._service = null;
            }
            Object.defineProperty(SessionProvider.prototype, "setRootVar", {
                get: function () {
                    return this._setRootVar;
                },
                set: function (value) {
                    this._setRootVar = !!value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SessionProvider.prototype, "session", {
                get: function () {
                    return this._session;
                },
                set: function (value) {
                    this._session = value;
                },
                enumerable: true,
                configurable: true
            });
            SessionProvider.prototype.$get = ['$rootScope', function ($rootScope) {
                "ngInject";
                if (this._service == null)
                    this._service = new SessionService(this._setRootVar, this._session, $rootScope);
                return this._service;
            }];
            return SessionProvider;
        }());
        angular.module('pipSession', ['pipPageReset'])
            .provider('pipSession', SessionProvider);
    })(session = pip.session || (pip.session = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var scope;
    (function (scope) {
        'use strict';
        angular.module('pipScope', ['pipTranslate', 'pipScope.Error', 'pipScope.Transaction']);
        angular.module('pipTransactions', ['pipScope']);
    })(scope = pip.scope || (pip.scope = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var scope;
    (function (scope_1) {
        'use strict';
        var thisModule = angular.module('pipScope.Error', []);
        thisModule.factory('pipError', ['$rootScope', function ($rootScope) {
            $rootScope.errors = {};
            return createError;
            function initError(scope) {
                $rootScope.errors[scope] = {
                    message: undefined,
                    code: undefined,
                    details: undefined
                };
            }
            ;
            function errorMessage(error) {
                if (_.isNull(error)) {
                    return null;
                }
                if (error.message) {
                    return error.message;
                }
                if (error.data) {
                    if (error.data.code) {
                        return 'ERROR_' + error.data.code;
                    }
                    if (error.data.message) {
                        return error.data.message;
                    }
                }
                if (error.statusText) {
                    return error.statusText;
                }
                if (error.status) {
                    return 'ERROR_' + error.status;
                }
                return error.data ? error.data : error;
            }
            ;
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
            }
            ;
            function errorDetails(error) {
                return error && error.data ? error.data : error;
            }
            ;
            function createError(scope, scopeObject) {
                scope = scope || 'global';
                var error = {
                    reset: function () {
                        initError(scope);
                    },
                    empty: function () {
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
                            $rootScope.errors[scope] = {
                                message: errorMessage(error),
                                code: errorCode(error),
                                details: errorDetails(error)
                            };
                            console.error($rootScope.errors[scope]);
                        }
                        else {
                            initError(scope);
                        }
                    }
                };
                if (_.isObject(scopeObject))
                    scopeObject.error = error;
                return error;
            }
            ;
        }]);
    })(scope = pip.scope || (pip.scope = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var scope;
    (function (scope_1) {
        'use strict';
        var thisModule = angular.module('pipScope.Transaction', ['pipTranslate']);
        thisModule.run(['$injector', function ($injector) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
            if (pipTranslate) {
                pipTranslate.setTranslations('en', {
                    'ENTERING': 'Entering...',
                    'PROCESSING': 'Processing...',
                    'LOADING': 'Loading...',
                    'SAVING': 'Saving...'
                });
                pipTranslate.setTranslations('ru', {
                    'ENTERING': 'Вход в систему...',
                    'PROCESSING': 'Обрабатывается...',
                    'LOADING': 'Загружается...',
                    'SAVING': 'Сохраняется...'
                });
            }
        }]);
        thisModule.factory('pipTransaction', ['$rootScope', 'pipError', function ($rootScope, pipError) {
            $rootScope.transactions = {};
            return createTransaction;
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
                        initTransaction("");
                        error.reset();
                    },
                    busy: function () {
                        var transaction = $rootScope.transactions[scope];
                        return transaction != null && transaction.id;
                    },
                    failed: function () {
                        return !error.empty();
                    },
                    aborted: function (id) {
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
                    abort: function () {
                        var transaction = $rootScope.transactions[scope];
                        if (transaction) {
                            transaction.id = null;
                        }
                        error.reset();
                    },
                    end: function (err) {
                        if (err)
                            error.set(err);
                        else
                            error.reset();
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
        }]);
    })(scope = pip.scope || (pip.scope = {}));
})(pip || (pip = {}));

(function () {
    'use strict';
    var thisModule = angular.module('pipCodes', []);
    thisModule.factory('pipCodes', function () {
        return {
            hash: hash,
            verification: verification
        };
        function hash(value) {
            if (value == null)
                return 0;
            var result = 0;
            for (var i = 0; i < value.length; i++) {
                result += value.charCodeAt(i);
            }
            return result;
        }
        function verification() {
            return Math.random().toString(36).substr(2, 10).toUpperCase();
        }
    });
})();



(function () {
    'use strict';
    var thisModule = angular.module('pipFormat', []);
    thisModule.factory('pipFormat', function () {
        function sample(value, maxLength) {
            if (!value || value == '')
                return '';
            var length = value.indexOf('\n');
            length = length >= 0 ? length : value.length;
            length = length < maxLength ? value.length : maxLength;
            return value.substring(0, length);
        }
        function strRepeat(str, qty) {
            if (qty < 1)
                return '';
            var result = '';
            while (qty > 0) {
                if (qty & 1)
                    result += str;
                qty >>= 1, str += str;
            }
            return result;
        }
        var sprintf = (function sprintf() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            function get_type(variable) {
                return toString.call(variable).slice(8, -1).toLowerCase();
            }
            var str_repeat = strRepeat;
            var str_format = function () {
                if (!str_format.cache.hasOwnProperty(arguments[0])) {
                    str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
                }
                return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
            };
            str_format.format = function (parse_tree, argv) {
                var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
                for (i = 0; i < tree_length; i++) {
                    node_type = get_type(parse_tree[i]);
                    if (node_type === 'string') {
                        output.push(parse_tree[i]);
                    }
                    else if (node_type === 'array') {
                        match = parse_tree[i];
                        if (match[2]) {
                            arg = argv[cursor];
                            for (k = 0; k < match[2].length; k++) {
                                if (!arg.hasOwnProperty(match[2][k])) {
                                    throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
                                }
                                arg = arg[match[2][k]];
                            }
                        }
                        else if (match[1]) {
                            arg = argv[match[1]];
                        }
                        else {
                            arg = argv[cursor++];
                        }
                        if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
                            throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
                        }
                        switch (match[8]) {
                            case 'b':
                                arg = arg.toString(2);
                                break;
                            case 'c':
                                arg = String.fromCharCode(arg);
                                break;
                            case 'd':
                                arg = parseInt(arg, 10);
                                break;
                            case 'e':
                                arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
                                break;
                            case 'f':
                                arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
                                break;
                            case 'o':
                                arg = arg.toString(8);
                                break;
                            case 's':
                                arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
                                break;
                            case 'u':
                                arg = Math.abs(arg);
                                break;
                            case 'x':
                                arg = arg.toString(16);
                                break;
                            case 'X':
                                arg = arg.toString(16).toUpperCase();
                                break;
                        }
                        arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+' + arg : arg);
                        pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                        pad_length = match[6] - String(arg).length;
                        pad = match[6] ? str_repeat(pad_character, pad_length) : '';
                        output.push(match[5] ? arg + pad : pad + arg);
                    }
                }
                return output.join('');
            };
            str_format.cache = {};
            str_format.parse = function (fmt) {
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
        })();
        return {
            sprintf: sprintf,
            format: sprintf,
            sample: sample
        };
    });
})();



(function () {
    'use strict';
    var thisModule = angular.module('pipPageReset', []);
    thisModule.factory('pipPageReset', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        $rootScope.$on('pipResetPage', resetAll);
        return {
            resetPartial: resetPartial,
            resetFull: resetFull,
            resetAll: resetAll,
            reset: reset
        };
        function resetPartial() {
            reset(false, true);
        }
        function resetFull() {
            reset(true, false);
        }
        function resetAll() {
            reset(true, true);
        }
        function reset(full, partial) {
            full = full !== undefined ? !!full : true;
            partial = partial !== undefined ? !!partial : true;
            if (full || partial) {
                $rootScope.$reset = full;
                $rootScope.$partialReset = partial;
                $timeout(function () {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }
        }
    }]);
})();

(function () {
    'use strict';
    var thisModule = angular.module('pipScroll', []);
    thisModule.factory('pipScroll', function () {
        return {
            scrollTo: scrollTo
        };
        function scrollTo(parentElement, childElement, animationDuration) {
            if (!parentElement || !childElement)
                return;
            if (animationDuration == undefined)
                animationDuration = 300;
            setTimeout(function () {
                if (!$(childElement).position())
                    return;
                var modDiff = Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                if (modDiff < 20)
                    return;
                var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                if (animationDuration > 0)
                    $(parentElement).animate({
                        scrollTop: scrollTo + 'px'
                    }, animationDuration);
            }, 100);
        }
    });
})();

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
        function getBrowserName() {
            var ua = $window.navigator.userAgent;
            if (ua.search(/Edge/) > -1)
                return "edge";
            if (ua.search(/MSIE/) > -1)
                return "ie";
            if (ua.search(/Trident/) > -1)
                return "ie";
            if (ua.search(/Firefox/) > -1)
                return "firefox";
            if (ua.search(/Opera/) > -1)
                return "opera";
            if (ua.search(/OPR/) > -1)
                return "opera";
            if (ua.search(/YaBrowser/) > -1)
                return "yabrowser";
            if (ua.search(/Chrome/) > -1)
                return "chrome";
            if (ua.search(/Safari/) > -1)
                return "safari";
            if (ua.search(/Maxthon/) > -1)
                return "maxthon";
            return "unknown";
        }
        function getBrowserVersion() {
            var browser, version;
            var ua = $window.navigator.userAgent;
            browser = getBrowserName();
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
        function isCordova() {
            return null;
        }
        function getOS() {
            var ua = $window.navigator.userAgent;
            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [ua])[0].replace('sunos', 'solaris'), osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            }
            catch (err) {
                return 'unknown';
            }
        }
        function isSupported(supported) {
            if (!supported)
                supported = {
                    edge: 11,
                    ie: 11,
                    firefox: 43,
                    opera: 35,
                    chrome: 47
                };
            var browser = getBrowserName();
            var version = getBrowserVersion();
            version = version.split(".")[0];
            if (browser && supported[browser] && version >= supported[browser])
                return true;
            return true;
        }
        ;
    }]);
})();

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
        }
        ;
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

var pip;
(function (pip) {
    var utilities;
    (function (utilities) {
        'use strict';
        var TimerEvent = (function () {
            function TimerEvent() {
            }
            return TimerEvent;
        }());
        var DefaultEvents = [
            { event: 'pipAutoPullChanges', timeout: 60000 },
            { event: 'pipAutoUpdatePage', timeout: 15000 },
            { event: 'pipAutoUpdateCollection', timeout: 300000 }
        ];
        var TimerService = (function () {
            TimerService.$inject = ['$rootScope', '$interval'];
            function TimerService($rootScope, $interval) {
                this._started = false;
                this._events = _.cloneDeep(DefaultEvents);
                this._rootScope = $rootScope;
                this._interval = $interval;
            }
            Object.defineProperty(TimerService.prototype, "isStarted", {
                get: function () {
                    return this._started;
                },
                enumerable: true,
                configurable: true
            });
            TimerService.prototype.addEvent = function (event, timeout) {
                var existingEvent = _.find(this._events, function (e) { return e.event == event; });
                if (existingEvent != null)
                    return;
                var newEvent = {
                    event: event,
                    timeout: timeout
                };
                this._events.push(newEvent);
                if (this._started)
                    this.startEvent(newEvent);
            };
            TimerService.prototype.removeEvent = function (event) {
                for (var i = this._events.length - 1; i >= 0; i--) {
                    var existingEvent = this._events[i];
                    if (existingEvent.event == event) {
                        this.stopEvent(existingEvent);
                        this._events.splice(i, 1);
                    }
                }
            };
            TimerService.prototype.clearEvents = function () {
                this.stop();
                this._events = [];
            };
            TimerService.prototype.startEvent = function (event) {
                var _this = this;
                event.interval = this._interval(function () { _this._rootScope.$broadcast(event.event); }, event.timeout);
            };
            TimerService.prototype.stopEvent = function (event) {
                if (event.interval != null) {
                    try {
                        this._interval.cancel(event.interval);
                    }
                    catch (ex) {
                    }
                    event.interval = null;
                }
            };
            TimerService.prototype.start = function () {
                var _this = this;
                if (this._started)
                    return;
                _.each(this._events, function (event) {
                    _this.startEvent(event);
                });
                this._started = true;
            };
            TimerService.prototype.stop = function () {
                var _this = this;
                _.each(this._events, function (event) {
                    _this.stopEvent(event);
                });
                this._started = false;
            };
            return TimerService;
        }());
        angular
            .module('pipTimer', [])
            .service('pipTimer', TimerService);
    })(utilities = pip.utilities || (pip.utilities = {}));
})(pip || (pip = {}));



var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        angular.module('pipTranslate', [
            'LocalStorageModule', 'pipTranslate.Service', 'pipTranslate.Filter', 'pipTranslate.Directive'
        ]);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        pipTranslateDirective.$inject = ['pipTranslate'];
        pipTranslateHtmlDirective.$inject = ['pipTranslate'];
        function pipTranslateDirective(pipTranslate) {
            "ngInject";
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
        }
        function pipTranslateHtmlDirective(pipTranslate) {
            "ngInject";
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
        }
        angular
            .module('pipTranslate.Directive', [])
            .directive('pipTranslate', pipTranslateDirective)
            .directive('pipTranslateHtml', pipTranslateHtmlDirective);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));

var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        translateFilter.$inject = ['pipTranslate'];
        optionalTranslateFilter.$inject = ['$injector'];
        function translateFilter(pipTranslate) {
            "ngInject";
            return function (key) {
                return pipTranslate.translate(key) || key;
            };
        }
        function optionalTranslateFilter($injector) {
            "ngInject";
            var pipTranslate = $injector.has('pipTranslate')
                ? $injector.get('pipTranslate') : null;
            return function (key) {
                return pipTranslate ? pipTranslate.translate(key) || key : key;
            };
        }
        angular
            .module('pipTranslate.Filter', [])
            .filter('translate', translateFilter);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pip;
(function (pip) {
    var translate;
    (function (translate) {
        'use strict';
        translate.LanguageRootVar = "$language";
        translate.LanguageChangedEvent = "pipLanguageChanged";
        var Translation = (function () {
            function Translation() {
                this._language = 'en';
                this._translations = {
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
            }
            Object.defineProperty(Translation.prototype, "language", {
                get: function () { return this._language; },
                set: function (value) { this._language = value; },
                enumerable: true,
                configurable: true
            });
            Translation.prototype.use = function (language) {
                if (language != null)
                    this._language = language;
                return this._language;
            };
            Translation.prototype.setTranslations = function (language, translations) {
                var map = this._translations[language] || {};
                this._translations[language] = _.extend(map, translations);
            };
            Translation.prototype.translate = function (key) {
                if (_.isNull(key) || _.isUndefined(key))
                    return '';
                var translations = this._translations[this._language] || {};
                return translations[key] || key;
            };
            Translation.prototype.translateArray = function (keys) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (k) {
                    var key = k || '';
                    values.push(translations[key] || key);
                });
                return values;
            };
            Translation.prototype.translateSet = function (keys, keyProp, valueProp) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                keyProp = keyProp || 'id';
                valueProp = valueProp || 'name';
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (key) {
                    var value = {};
                    key = key || '';
                    value[keyProp] = key;
                    value[valueProp] = translations[key] || key;
                    values.push(value);
                });
                return values;
            };
            Translation.prototype.translateObjects = function (items, keyProp, valueProp) {
                if (_.isNull(items) || items.length == 0)
                    return [];
                keyProp = keyProp || 'name';
                valueProp = valueProp || 'nameLocal';
                var translations = this._translations[this._language] || {};
                _.each(items, function (item) {
                    var key = item[keyProp] || '';
                    item[valueProp] = translations[key] || key;
                });
                return items;
            };
            Translation.prototype.translateWithPrefix = function (prefix, key) {
                prefix = prefix ? prefix + '_' : '';
                key = (prefix + key).replace(/ /g, '_').toUpperCase();
                if (key == null)
                    return '';
                var translations = this._translations[this._language] || {};
                return translations[key] || key;
            };
            ;
            Translation.prototype.translateSetWithPrefix = function (prefix, keys, keyProp, valueProp) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() : '';
                keyProp = keyProp || 'id';
                valueProp = valueProp || 'name';
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (key) {
                    var value = {};
                    key = key || '';
                    value[keyProp] = key;
                    value[valueProp] = translations[prefix + '_' + key] || key;
                    values.push(value);
                });
                return values;
            };
            Translation.prototype.translateSetWithPrefix2 = function (prefix, keys, keyProp, valueProp) {
                if (_.isNull(keys) || keys.length == 0)
                    return [];
                keyProp = keyProp || 'id';
                valueProp = valueProp || 'name';
                prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() + '_' : '';
                var values = [];
                var translations = this._translations[this._language] || {};
                _.each(keys, function (key) {
                    var value = {};
                    key = key || '';
                    value[keyProp] = key;
                    value[valueProp] = translations[prefix + key.replace(/ /g, '_').toUpperCase()]
                        || (prefix + key.replace(/ /g, '_').toUpperCase());
                    values.push(value);
                });
                return values;
            };
            return Translation;
        }());
        var TranslateService = (function () {
            function TranslateService(translation, setRootVar, persist, $rootScope, localStorageService) {
                this._setRootVar = setRootVar;
                this._persist = persist;
                this._translation = translation;
                this._rootScope = $rootScope;
                this._storage = localStorageService;
                if (this._persist) {
                    this._translation.language = localStorageService.get('language')
                        || this._translation.language;
                }
                this.save();
            }
            TranslateService.prototype.save = function () {
                if (this._setRootVar)
                    this._rootScope[pip.translate.LanguageRootVar] = this._translation.language;
                if (this._persist)
                    this._storage.set('language', this._translation.language);
            };
            Object.defineProperty(TranslateService.prototype, "language", {
                get: function () {
                    return this._translation.language;
                },
                set: function (value) {
                    if (value != this._translation.language) {
                        this._translation.language = value;
                        this.save();
                        this._rootScope.$broadcast(pip.translate.LanguageChangedEvent, value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            TranslateService.prototype.use = function (language) {
                if (language != null)
                    this.language = language;
                return this.language;
            };
            TranslateService.prototype.setTranslations = function (language, translations) {
                return this._translation.setTranslations(language, translations);
            };
            TranslateService.prototype.translate = function (key) {
                return this._translation.translate(key);
            };
            TranslateService.prototype.translateArray = function (keys) {
                return this._translation.translateArray(keys);
            };
            TranslateService.prototype.translateSet = function (keys, keyProp, valueProp) {
                return this._translation.translateSet(keys, keyProp, valueProp);
            };
            TranslateService.prototype.translateObjects = function (items, keyProp, valueProp) {
                return this._translation.translateObjects(items, keyProp, valueProp);
            };
            TranslateService.prototype.translateWithPrefix = function (prefix, key) {
                return this._translation.translateWithPrefix(prefix, key);
            };
            TranslateService.prototype.translateSetWithPrefix = function (prefix, keys, keyProp, valueProp) {
                return this._translation.translateSetWithPrefix(prefix, keys, keyProp, valueProp);
            };
            TranslateService.prototype.translateSetWithPrefix2 = function (prefix, keys, keyProp, valueProp) {
                return this._translation.translateSetWithPrefix2(prefix, keys, keyProp, valueProp);
            };
            return TranslateService;
        }());
        var TranslateProvider = (function (_super) {
            __extends(TranslateProvider, _super);
            function TranslateProvider() {
                _super.call(this);
            }
            Object.defineProperty(TranslateProvider.prototype, "setRootVar", {
                get: function () {
                    return this._setRootVar;
                },
                set: function (value) {
                    this._setRootVar = !!value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TranslateProvider.prototype, "persist", {
                get: function () {
                    return this._persist;
                },
                set: function (value) {
                    this._persist = !!value;
                },
                enumerable: true,
                configurable: true
            });
            TranslateProvider.prototype.$get = ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
                "ngInject";
                if (this._service == null)
                    this._service = new TranslateService(this, this._setRootVar, this._persist, $rootScope, localStorageService);
                return this._service;
            }];
            return TranslateProvider;
        }(Translation));
        angular
            .module('pipTranslate.Service', [])
            .provider('pipTranslate', TranslateProvider);
    })(translate = pip.translate || (pip.translate = {}));
})(pip || (pip = {}));



//# sourceMappingURL=pip-webui-services.js.map
