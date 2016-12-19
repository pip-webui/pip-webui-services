(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).services = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require("./translate");
require("./session");
require("./transactions");
require("./routing");
require("./utilities");
angular.module('pipServices', [
    'pipTranslate',
    'pipSession',
    'pipTransaction',
    'pipRouting',
    'pipFormat',
    'pipTimer',
    'pipScroll',
    'pipTags',
    'pipCodes',
    'pipSystemInfo',
    'pipPageReset'
]);
__export(require("./translate"));
__export(require("./session"));
__export(require("./transactions"));
__export(require("./routing"));
__export(require("./utilities"));
},{"./routing":5,"./session":8,"./transactions":13,"./translate":18,"./utilities":25}],2:[function(require,module,exports){
'use strict';
captureStateTranslations.$inject = ['$rootScope'];
decorateBackStateService.$inject = ['$delegate', '$window'];
addBackStateDecorator.$inject = ['$provide'];
function captureStateTranslations($rootScope) {
    "ngInject";
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        exports.CurrentState = {
            name: toState.name,
            url: toState.url,
            params: toParams
        };
        exports.PreviousState = {
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
        if (exports.PreviousState != null
            && exports.PreviousState.name != null) {
            var state = _.cloneDeep(exports.PreviousState);
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
    .module('pipRouting')
    .config(addBackStateDecorator)
    .run(captureStateTranslations);
},{}],3:[function(require,module,exports){
'use strict';
decorateRedirectStateProvider.$inject = ['$delegate'];
addRedirectStateProviderDecorator.$inject = ['$provide'];
decorateRedirectStateService.$inject = ['$delegate', '$timeout'];
addRedirectStateDecorator.$inject = ['$provide'];
var RedirectedStates = {};
function decorateRedirectStateProvider($delegate) {
    "ngInject";
    $delegate.redirect = redirect;
    return $delegate;
    function redirect(fromState, toState) {
        RedirectedStates[fromState] = toState;
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
        var toState = RedirectedStates[state.name];
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
    .module('pipRouting')
    .config(addRedirectStateProviderDecorator)
    .config(addRedirectStateDecorator);
},{}],4:[function(require,module,exports){
'use strict';
hookRoutingEvents.$inject = ['$rootScope', '$log', '$state'];
exports.RoutingVar = "$routing";
function hookRoutingEvents($rootScope, $log, $state) {
    "ngInject";
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $rootScope[exports.RoutingVar] = true;
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope[exports.RoutingVar] = false;
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        $rootScope[exports.RoutingVar] = false;
        $log.error('Error while switching route to ' + toState.name);
        $log.error(error);
    });
    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        event.preventDefault();
        $rootScope[exports.RoutingVar] = false;
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
    .module('pipRouting')
    .run(hookRoutingEvents);
},{}],5:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipRouting', ['ui.router']);
require("./BackDecorator");
require("./RedirectDecorator");
require("./RoutingEvents");
__export(require("./BackDecorator"));
__export(require("./RoutingEvents"));
},{"./BackDecorator":2,"./RedirectDecorator":3,"./RoutingEvents":4}],6:[function(require,module,exports){
'use strict';
exports.IdentityRootVar = "$identity";
exports.IdentityChangedEvent = "pipIdentityChanged";
var IdentityService = (function () {
    function IdentityService(setRootVar, identity, $rootScope, $log) {
        this._setRootVar = setRootVar;
        this._identity = identity;
        this._rootScope = $rootScope;
        this._log = $log;
        this.setRootVar();
    }
    IdentityService.prototype.setRootVar = function () {
        if (this._setRootVar)
            this._rootScope[exports.IdentityRootVar] = this._identity;
    };
    Object.defineProperty(IdentityService.prototype, "identity", {
        get: function () {
            return this._identity;
        },
        set: function (value) {
            this._identity = value;
            this.setRootVar();
            this._rootScope.$emit(exports.IdentityChangedEvent, this._identity);
            var identity = value || {};
            this._log.debug("Changed identity to " + JSON.stringify(identity));
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
    IdentityProvider.prototype.$get = ['$rootScope', '$log', function ($rootScope, $log) {
        "ngInject";
        if (this._service == null)
            this._service = new IdentityService(this._setRootVar, this._identity, $rootScope, $log);
        return this._service;
    }];
    return IdentityProvider;
}());
angular
    .module('pipSession')
    .provider('pipIdentity', IdentityProvider);
},{}],7:[function(require,module,exports){
'use strict';
exports.SessionRootVar = "$session";
exports.SessionOpenedEvent = "pipSessionOpened";
exports.SessionClosedEvent = "pipSessionClosed";
var SessionService = (function () {
    function SessionService(setRootVar, session, $rootScope, $log) {
        this._setRootVar = setRootVar;
        this._session = session;
        this._rootScope = $rootScope;
        this._log = $log;
        this.setRootVar();
    }
    SessionService.prototype.setRootVar = function () {
        if (this._setRootVar)
            this._rootScope[exports.SessionRootVar] = this._session;
    };
    Object.defineProperty(SessionService.prototype, "session", {
        get: function () {
            return this._session;
        },
        enumerable: true,
        configurable: true
    });
    SessionService.prototype.isOpened = function () {
        return this._session != null;
    };
    SessionService.prototype.open = function (session, fullReset, partialReset) {
        if (fullReset === void 0) { fullReset = false; }
        if (partialReset === void 0) { partialReset = false; }
        if (session == null)
            throw new Error("Session cannot be null");
        this._session = session;
        this.setRootVar();
        this._rootScope.$emit(exports.SessionOpenedEvent, session);
        this._log.debug("Opened session " + session);
    };
    SessionService.prototype.close = function (fullReset, partialReset) {
        if (fullReset === void 0) { fullReset = false; }
        if (partialReset === void 0) { partialReset = false; }
        var oldSession = this._session;
        this._session = null;
        this.setRootVar();
        this._rootScope.$emit(exports.SessionClosedEvent, oldSession);
        this._log.debug("Closed session " + oldSession);
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
    SessionProvider.prototype.$get = ['$rootScope', '$log', function ($rootScope, $log) {
        "ngInject";
        if (this._service == null)
            this._service = new SessionService(this._setRootVar, this._session, $rootScope, $log);
        return this._service;
    }];
    return SessionProvider;
}());
angular
    .module('pipSession')
    .provider('pipSession', SessionProvider);
},{}],8:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipSession', []);
require("./IdentityService");
require("./SessionService");
__export(require("./IdentityService"));
__export(require("./SessionService"));
},{"./IdentityService":6,"./SessionService":7}],9:[function(require,module,exports){
'use strict';
var TransactionError_1 = require("./TransactionError");
var Transaction = (function () {
    function Transaction(scope) {
        this._scope = null;
        this._id = null;
        this._operation = null;
        this._error = new TransactionError_1.TransactionError();
        this._progress = 0;
        this._scope = scope;
    }
    Object.defineProperty(Transaction.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "operation", {
        get: function () {
            return this._operation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "error", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "errorMessage", {
        get: function () {
            return this._error.message;
        },
        enumerable: true,
        configurable: true
    });
    Transaction.prototype.reset = function () {
        this._id = null;
        this._operation = null;
        this._progress = 0;
        this._error.reset();
    };
    Transaction.prototype.busy = function () {
        return this._id != null;
    };
    Transaction.prototype.failed = function () {
        return !this._error.empty();
    };
    Transaction.prototype.aborted = function (id) {
        return this._id != id;
    };
    Transaction.prototype.begin = function (operation) {
        if (this._id != null)
            return null;
        this._id = new Date().getTime().toString();
        this._operation = operation || 'PROCESSING';
        this._error.reset();
        return this._id;
    };
    Transaction.prototype.update = function (progress) {
        this._progress = Math.max(progress, 100);
    };
    Transaction.prototype.abort = function () {
        this._id = null;
        this._error.reset();
    };
    Transaction.prototype.end = function (error) {
        this._error.decode(error);
        this._id = null;
    };
    return Transaction;
}());
exports.Transaction = Transaction;
},{"./TransactionError":10}],10:[function(require,module,exports){
'use strict';
var TransactionError = (function () {
    function TransactionError(error) {
        if (error != null)
            this.decode(error);
    }
    TransactionError.prototype.reset = function () {
        this.code = null;
        this.message = null;
        this.details = null;
        this.cause = null;
        this.stack_trace = null;
    };
    TransactionError.prototype.empty = function () {
        return this.message = null && this.code == null;
    };
    TransactionError.prototype.decode = function (error) {
        this.reset();
        if (error == null)
            return;
        if (error.message)
            this.message = error.message;
        if (error.data) {
            if (error.data.code) {
                this.message = this.message || 'ERROR_' + error.data.code;
                this.code = this.code || error.data.code;
            }
            if (error.data.message)
                this.message = this.message || error.data.message;
            this.message = this.message || error.data;
            this.details = this.details || error.data;
            this.cause = error.data.cause;
            this.stack_trace = error.data.stack_trace;
            this.details = error.data.details;
        }
        if (error.statusText)
            this.message = this.message || error.statusText;
        if (error.status) {
            this.message = this.message || 'ERROR_' + error.status;
            this.code = this.code || error.status;
        }
        this.message = this.message || error;
        this.details = this.details || error;
    };
    return TransactionError;
}());
exports.TransactionError = TransactionError;
},{}],11:[function(require,module,exports){
'use strict';
var Transaction_1 = require("./Transaction");
var TransactionService = (function () {
    function TransactionService() {
        this._transactions = {};
    }
    TransactionService.prototype.create = function (scope) {
        var transaction = new Transaction_1.Transaction(scope);
        if (scope != null)
            this._transactions[scope] = transaction;
        return transaction;
    };
    TransactionService.prototype.get = function (scope) {
        var transaction = scope != null ? this._transactions[scope] : null;
        if (transaction == null) {
            transaction = new Transaction_1.Transaction(scope);
            if (scope != null)
                this._transactions[scope] = transaction;
        }
        return transaction;
    };
    return TransactionService;
}());
angular
    .module('pipTransaction')
    .service('pipTransaction', TransactionService);
},{"./Transaction":9}],12:[function(require,module,exports){
'use strict';
configureTransactionStrings.$inject = ['$injector'];
function configureTransactionStrings($injector) {
    "ngInject";
    var pipTranslate = $injector.has('pipTranslateProvider') ? $injector.get('pipTranslateProvider') : null;
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
}
angular
    .module('pipTransaction')
    .config(configureTransactionStrings);
},{}],13:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipTransaction', []);
require("./TransactionStrings");
require("./TransactionError");
require("./Transaction");
require("./TransactionService");
__export(require("./TransactionError"));
__export(require("./Transaction"));
},{"./Transaction":9,"./TransactionError":10,"./TransactionService":11,"./TransactionStrings":12}],14:[function(require,module,exports){
'use strict';
translateDirective.$inject = ['pipTranslate'];
translateHtmlDirective.$inject = ['pipTranslate'];
function translateDirective(pipTranslate) {
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
function translateHtmlDirective(pipTranslate) {
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
    .module('pipTranslate')
    .directive('pipTranslate', translateDirective)
    .directive('pipTranslateHtml', translateHtmlDirective);
},{}],15:[function(require,module,exports){
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
    .module('pipTranslate')
    .filter('translate', translateFilter);
},{}],16:[function(require,module,exports){
'use strict';
initTranslate.$inject = ['pipTranslate'];
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Translation_1 = require("./Translation");
var PageResetService_1 = require("../utilities/PageResetService");
exports.LanguageRootVar = "$language";
exports.LanguageChangedEvent = "pipLanguageChanged";
var TranslateService = (function () {
    function TranslateService(translation, setRootVar, persist, $rootScope, $log, $window, $mdDateLocale) {
        this._setRootVar = setRootVar;
        this._persist = persist;
        this._translation = translation;
        this._rootScope = $rootScope;
        this._log = $log;
        this._window = $window;
        this._mdDateLocale = $mdDateLocale;
        if (this._persist && this._window.localStorage)
            this._translation.language = this._window.localStorage.getItem('language') || this._translation.language;
        this._log.debug("Set language to " + this._translation.language);
        this.save();
    }
    TranslateService.prototype.changeLocale = function (locale) {
        if (!locale)
            return;
        var localeDate;
        moment.locale(locale);
        localeDate = moment.localeData();
        this._mdDateLocale.months = angular.isArray(localeDate._months) ? localeDate._months : localeDate._months.format;
        this._mdDateLocale.shortMonths = angular.isArray(localeDate._monthsShort) ? localeDate._monthsShort : localeDate._monthsShort.format;
        this._mdDateLocale.days = angular.isArray(localeDate._weekdays) ? localeDate._weekdays : localeDate._weekdays.format;
        this._mdDateLocale.shortDays = localeDate._weekdaysMin;
        this._mdDateLocale.firstDayOfWeek = localeDate._week.dow;
    };
    TranslateService.prototype.save = function () {
        if (this._setRootVar)
            this._rootScope[exports.LanguageRootVar] = this._translation.language;
        if (this._persist && this._window.localStorage != null)
            this._window.localStorage.setItem('language', this._translation.language);
    };
    Object.defineProperty(TranslateService.prototype, "language", {
        get: function () {
            return this._translation.language;
        },
        set: function (value) {
            if (value != this._translation.language) {
                this._translation.language = value;
                this._log.debug("Changing language to " + value);
                this.changeLocale(this._translation.language);
                this.save();
                this._rootScope.$emit(exports.LanguageChangedEvent, value);
                this._rootScope.$emit(PageResetService_1.ResetPageEvent);
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
    TranslateService.prototype.translations = function (language, translations) {
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
        var _this = _super.call(this) || this;
        _this._setRootVar = true;
        _this._persist = true;
        return _this;
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
    TranslateProvider.prototype.$get = ['$rootScope', '$log', '$window', '$mdDateLocale', function ($rootScope, $log, $window, $mdDateLocale) {
        "ngInject";
        if (this._service == null)
            this._service = new TranslateService(this, this._setRootVar, this._persist, $rootScope, $log, $window, $mdDateLocale);
        return this._service;
    }];
    return TranslateProvider;
}(Translation_1.Translation));
function initTranslate(pipTranslate) {
    pipTranslate.language;
}
angular
    .module('pipTranslate')
    .provider('pipTranslate', TranslateProvider)
    .run(initTranslate);
},{"../utilities/PageResetService":19,"./Translation":17}],17:[function(require,module,exports){
'use strict';
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
    Translation.prototype.translations = function (language, translations) {
        this.setTranslations(language, translations);
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
exports.Translation = Translation;
},{}],18:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
angular.module('pipTranslate', []);
require("./Translation");
require("./TranslateService");
require("./TranslateFilter");
require("./TranslateDirective");
__export(require("./Translation"));
__export(require("./TranslateService"));
},{"./TranslateDirective":14,"./TranslateFilter":15,"./TranslateService":16,"./Translation":17}],19:[function(require,module,exports){
'use strict';
hookResetEvents.$inject = ['$rootScope', 'pipPageReset'];
exports.ResetPageEvent = "pipResetPage";
exports.ResetAreaEvent = "pipResetArea";
exports.ResetRootVar = "$reset";
exports.ResetAreaRootVar = "$resetArea";
var PageResetService = (function () {
    PageResetService.$inject = ['$rootScope', '$log', '$timeout'];
    function PageResetService($rootScope, $log, $timeout) {
        this._rootScope = $rootScope;
        this._log = $log;
        this._timeout = $timeout;
        $rootScope[exports.ResetRootVar] = false;
        $rootScope[exports.ResetAreaRootVar] = null;
    }
    PageResetService.prototype.reset = function () {
        this._log.debug("Resetting the entire page");
        this.performReset(null);
    };
    PageResetService.prototype.resetArea = function (area) {
        this._log.debug("Resetting the area " + area);
        this.performReset(area);
    };
    PageResetService.prototype.performReset = function (area) {
        var _this = this;
        this._rootScope[exports.ResetRootVar] = area == null;
        this._rootScope[exports.ResetAreaRootVar] = area;
        this._timeout(function () {
            _this._rootScope[exports.ResetRootVar] = false;
            _this._rootScope[exports.ResetAreaRootVar] = null;
        }, 0);
    };
    return PageResetService;
}());
function hookResetEvents($rootScope, pipPageReset) {
    $rootScope.$on(exports.ResetPageEvent, function () { pipPageReset.reset(); });
    $rootScope.$on(exports.ResetAreaEvent, function (event, area) { pipPageReset.resetArea(area); });
}
angular.module('pipPageReset', [])
    .service('pipPageReset', PageResetService)
    .run(hookResetEvents);
},{}],20:[function(require,module,exports){
'use strict';
var ScrollService = (function () {
    function ScrollService() {
    }
    ScrollService.prototype.scrollTo = function (parentElement, childElement, animationDuration) {
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
    };
    return ScrollService;
}());
angular
    .module('pipScroll', [])
    .service('pipScroll', ScrollService);
},{}],21:[function(require,module,exports){
'use strict';
var SystemInfo = (function () {
    SystemInfo.$inject = ['$window'];
    function SystemInfo($window) {
        "ngInject";
        this._window = $window;
    }
    Object.defineProperty(SystemInfo.prototype, "browserName", {
        get: function () {
            var ua = this._window.navigator.userAgent;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemInfo.prototype, "browserVersion", {
        get: function () {
            var version;
            var ua = this._window.navigator.userAgent;
            var browser = this.browserName;
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
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemInfo.prototype, "platform", {
        get: function () {
            var ua = this._window.navigator.userAgent;
            if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase()))
                return 'mobile';
            return 'desktop';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemInfo.prototype, "os", {
        get: function () {
            var ua = this._window.navigator.userAgent;
            try {
                var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [ua])[0].replace('sunos', 'solaris');
                var osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
                return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
            }
            catch (err) {
                return 'unknown';
            }
        },
        enumerable: true,
        configurable: true
    });
    SystemInfo.prototype.isDesktop = function () {
        return this.platform == 'desktop';
    };
    SystemInfo.prototype.isMobile = function () {
        return this.platform == 'mobile';
    };
    SystemInfo.prototype.isCordova = function () {
        return false;
    };
    SystemInfo.prototype.isSupported = function (supported) {
        if (!supported)
            supported = {
                edge: 11,
                ie: 11,
                firefox: 43,
                opera: 35,
                chrome: 47
            };
        var browser = this.browserName;
        var version = this.browserVersion;
        version = version.split(".")[0];
        if (browser && supported[browser] && version >= supported[browser])
            return true;
        return true;
    };
    return SystemInfo;
}());
angular
    .module('pipSystemInfo', [])
    .service('pipSystemInfo', SystemInfo);
},{}],22:[function(require,module,exports){
'use strict';
var TimerEvent = (function () {
    function TimerEvent(event, timeout) {
        this.event = event;
        this.timeout = timeout;
    }
    return TimerEvent;
}());
var DefaultEvents = [
    new TimerEvent('pipAutoPullChanges', 60000),
    new TimerEvent('pipAutoUpdatePage', 15000),
    new TimerEvent('pipAutoUpdateCollection', 300000)
];
var TimerService = (function () {
    TimerService.$inject = ['$rootScope', '$log', '$interval'];
    function TimerService($rootScope, $log, $interval) {
        "ngInject";
        this._started = false;
        this._events = _.cloneDeep(DefaultEvents);
        this._rootScope = $rootScope;
        this._log = $log;
        this._interval = $interval;
    }
    TimerService.prototype.isStarted = function () {
        return this._started;
    };
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
        event.interval = this._interval(function () {
            _this._log.debug('Generated timer event ' + event.event);
            _this._rootScope.$emit(event.event);
        }, event.timeout);
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
angular.module('pipTimer', [])
    .service('pipTimer', TimerService);
},{}],23:[function(require,module,exports){
'use strict';
var Codes = (function () {
    function Codes() {
    }
    Codes.prototype.hash = function (value) {
        if (value == null)
            return 0;
        var result = 0;
        for (var i = 0; i < value.length; i++)
            result += value.charCodeAt(i);
        return result;
    };
    Codes.prototype.verification = function () {
        return Math.random().toString(36).substr(2, 10).toUpperCase();
    };
    return Codes;
}());
angular
    .module('pipCodes', [])
    .service('pipCodes', Codes);
},{}],24:[function(require,module,exports){
'use strict';
var Format = (function () {
    function Format() {
        this.cache = {};
    }
    Format.prototype.sample = function (value, maxLength) {
        if (!value || value == '')
            return '';
        var length = value.indexOf('\n');
        length = length >= 0 ? length : value.length;
        length = length < maxLength ? value.length : maxLength;
        return value.substring(0, length);
    };
    Format.prototype.strRepeat = function (str, qty) {
        if (qty < 1)
            return '';
        var result = '';
        while (qty > 0) {
            if (qty & 1)
                result += str;
            qty >>= 1, str += str;
        }
        return result;
    };
    Format.prototype.getType = function (variable) {
        return toString.call(variable).slice(8, -1).toLowerCase();
    };
    Format.prototype.parseFormat = function (fmt) {
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
                                throw new Error('Unknown error');
                            }
                        }
                    }
                    else {
                        throw new Error('Unknown error');
                    }
                    match[2] = field_list;
                }
                else {
                    arg_names |= 2;
                }
                if (arg_names === 3) {
                    throw new Error('Mixing positional and named placeholders is not (yet) supported');
                }
                parse_tree.push(match);
            }
            else {
                throw new Error('Unknown error');
            }
            _fmt = _fmt.substring(match[0].length);
        }
        return parse_tree;
    };
    Format.prototype.format = function (parse_tree, argv) {
        var cursor = 0;
        var tree_length = parse_tree.length;
        var output = [];
        for (var i = 0; i < tree_length; i++) {
            var node_type = this.getType(parse_tree[i]);
            if (node_type === 'string') {
                output.push(parse_tree[i]);
            }
            else if (node_type === 'array') {
                var match = parse_tree[i];
                var arg = void 0;
                if (match[2]) {
                    arg = argv[cursor];
                    for (var k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(this.sprintf('Property "%s" does not exist', match[2][k]));
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
                if (/[^s]/.test(match[8]) && (this.getType(arg) != 'number')) {
                    throw new Error(this.sprintf('Expecting number but found %s', this.getType(arg)));
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
                var pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
                var pad_length = match[6] - String(arg).length;
                var pad = match[6] ? this.strRepeat(pad_character, pad_length) : '';
                output.push(match[5] ? arg + pad : pad + arg);
            }
        }
        return output.join('');
    };
    Format.prototype.sprintf = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.cache.hasOwnProperty(message))
            this.cache[message] = this.parseFormat(message);
        return this.format(this.cache[message], args);
    };
    return Format;
}());
angular
    .module('pipFormat', [])
    .service('pipFormat', Format);
},{}],25:[function(require,module,exports){
'use strict';
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
require("./Format");
require("./TimerService");
require("./ScrollService");
require("./Tags");
require("./Codes");
require("./SystemInfo");
require("./PageResetService");
__export(require("./PageResetService"));
},{"./Codes":23,"./Format":24,"./PageResetService":19,"./ScrollService":20,"./SystemInfo":21,"./Tags":26,"./TimerService":22}],26:[function(require,module,exports){
'use strict';
var Tags = (function () {
    function Tags() {
    }
    Tags.prototype.normalizeOne = function (tag) {
        return tag
            ? _.trim(tag.replace(/(_|#)+/g, ' '))
            : null;
    };
    Tags.prototype.compressOne = function (tag) {
        return tag
            ? tag.replace(/( |_|#)/g, '').toLowerCase()
            : null;
    };
    Tags.prototype.equal = function (tag1, tag2) {
        if (tag1 == null && tag2 == null)
            return true;
        if (tag1 == null || tag2 == null)
            return false;
        return this.compressOne(tag1) == this.compressOne(tag2);
    };
    Tags.prototype.normalizeAll = function (tags) {
        var _this = this;
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);
        tags = _.map(tags, function (tag) { return _this.normalizeOne(tag); });
        return tags;
    };
    Tags.prototype.compressAll = function (tags) {
        var _this = this;
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);
        tags = _.map(tags, function (tag) { return _this.compressOne(tag); });
        return tags;
    };
    Tags.prototype.extract = function (entity, searchFields) {
        var _this = this;
        var tags = this.normalizeAll(entity.tags);
        _.each(searchFields, function (field) {
            var text = entity[field] || '';
            if (text != '') {
                var hashTags = text.match(/#\w+/g);
                tags = tags.concat(_this.normalizeAll(hashTags));
            }
        });
        return _.uniq(tags);
    };
    return Tags;
}());
angular
    .module('pipTags', [])
    .service('pipTags', Tags);
},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXgudHMiLCJzcmMvcm91dGluZy9CYWNrRGVjb3JhdG9yLnRzIiwic3JjL3JvdXRpbmcvUmVkaXJlY3REZWNvcmF0b3IudHMiLCJzcmMvcm91dGluZy9Sb3V0aW5nRXZlbnRzLnRzIiwic3JjL3JvdXRpbmcvaW5kZXgudHMiLCJzcmMvc2Vzc2lvbi9JZGVudGl0eVNlcnZpY2UudHMiLCJzcmMvc2Vzc2lvbi9TZXNzaW9uU2VydmljZS50cyIsInNyYy9zZXNzaW9uL2luZGV4LnRzIiwic3JjL3RyYW5zYWN0aW9ucy9UcmFuc2FjdGlvbi50cyIsInNyYy90cmFuc2FjdGlvbnMvVHJhbnNhY3Rpb25FcnJvci50cyIsInNyYy90cmFuc2FjdGlvbnMvVHJhbnNhY3Rpb25TZXJ2aWNlLnRzIiwic3JjL3RyYW5zYWN0aW9ucy9UcmFuc2FjdGlvblN0cmluZ3MudHMiLCJzcmMvdHJhbnNhY3Rpb25zL2luZGV4LnRzIiwic3JjL3RyYW5zbGF0ZS9UcmFuc2xhdGVEaXJlY3RpdmUudHMiLCJzcmMvdHJhbnNsYXRlL1RyYW5zbGF0ZUZpbHRlci50cyIsInNyYy90cmFuc2xhdGUvVHJhbnNsYXRlU2VydmljZS50cyIsInNyYy90cmFuc2xhdGUvVHJhbnNsYXRpb24udHMiLCJzcmMvdHJhbnNsYXRlL2luZGV4LnRzIiwic3JjL3V0aWxpdGllcy9QYWdlUmVzZXRTZXJ2aWNlLnRzIiwic3JjL3V0aWxpdGllcy9TY3JvbGxTZXJ2aWNlLnRzIiwic3JjL3V0aWxpdGllcy9TeXN0ZW1JbmZvLnRzIiwic3JjL3V0aWxpdGllcy9UaW1lclNlcnZpY2UudHMiLCJzcmNcXHV0aWxpdGllc1xcc3JjXFx1dGlsaXRpZXNcXENvZGVzLnRzIiwic3JjXFx1dGlsaXRpZXNcXHNyY1xcdXRpbGl0aWVzXFxGb3JtYXQudHMiLCJzcmMvdXRpbGl0aWVzL2luZGV4LnRzIiwic3JjXFx1dGlsaXRpZXNcXHNy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ZCxVQUFlLE1BQVcsRUFBRSxZQUF1QjtRQUFuRCxpQkFhQztRQVpHLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQUMsS0FBSztZQUN2QixJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRS9CLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25DLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ0wsV0FBQztBQUFELENBdERBLEFBc0RDLElBQUE7QUFHRCxPQUFPO0tBQ0YsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUM7S0FDckIsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu78ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgJy4vdHJhbnNsYXRlJztcclxuaW1wb3J0ICcuL3Nlc3Npb24nO1xyXG5pbXBvcnQgJy4vdHJhbnNhY3Rpb25zJztcclxuaW1wb3J0ICcuL3JvdXRpbmcnO1xyXG5pbXBvcnQgJy4vdXRpbGl0aWVzJztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBTZXJ2aWNlcycsIFtcclxuICAgICdwaXBUcmFuc2xhdGUnLFxyXG4gICAgJ3BpcFNlc3Npb24nLFxyXG4gICAgJ3BpcFRyYW5zYWN0aW9uJyxcclxuICAgICdwaXBSb3V0aW5nJyxcclxuICAgICdwaXBGb3JtYXQnLFxyXG4gICAgJ3BpcFRpbWVyJyxcclxuICAgICdwaXBTY3JvbGwnLFxyXG4gICAgJ3BpcFRhZ3MnLFxyXG4gICAgJ3BpcENvZGVzJyxcclxuICAgICdwaXBTeXN0ZW1JbmZvJyxcclxuICAgICdwaXBQYWdlUmVzZXQnXHJcbl0pO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi90cmFuc2xhdGUnO1xyXG5leHBvcnQgKiBmcm9tICcuL3Nlc3Npb24nO1xyXG5leHBvcnQgKiBmcm9tICcuL3RyYW5zYWN0aW9ucyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vcm91dGluZyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdXRpbGl0aWVzJztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGxldCBDdXJyZW50U3RhdGU6IGFueTtcclxuZXhwb3J0IGxldCBQcmV2aW91c1N0YXRlOiBhbnk7XHJcblxyXG5mdW5jdGlvbiBjYXB0dXJlU3RhdGVUcmFuc2xhdGlvbnMoJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsXHJcbiAgICAgICAgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgIEN1cnJlbnRTdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IHRvU3RhdGUubmFtZSwgXHJcbiAgICAgICAgICAgICAgICB1cmw6IHRvU3RhdGUudXJsLCBcclxuICAgICAgICAgICAgICAgIHBhcmFtczogdG9QYXJhbXNcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIFByZXZpb3VzU3RhdGUgPSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBmcm9tU3RhdGUubmFtZSwgXHJcbiAgICAgICAgICAgICAgICB1cmw6IGZyb21TdGF0ZS51cmwsIFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBmcm9tUGFyYW1zXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlY29yYXRlQmFja1N0YXRlU2VydmljZSgkZGVsZWdhdGUsICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlKSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgJGRlbGVnYXRlLmdvQmFjayA9IGdvQmFjaztcclxuICAgICRkZWxlZ2F0ZS5nb0JhY2tBbmRTZWxlY3QgPSBnb0JhY2tBbmRTZWxlY3Q7XHJcblxyXG4gICAgcmV0dXJuICRkZWxlZ2F0ZTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgZnVuY3Rpb24gZ29CYWNrKCk6IHZvaWQge1xyXG4gICAgICAgICR3aW5kb3cuaGlzdG9yeS5iYWNrKClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnb0JhY2tBbmRTZWxlY3QocGFyYW1zOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBpZiAoUHJldmlvdXNTdGF0ZSAhPSBudWxsIFxyXG4gICAgICAgICAgICAmJiBQcmV2aW91c1N0YXRlLm5hbWUgIT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gXy5jbG9uZURlZXAoUHJldmlvdXNTdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBPdmVycmlkZSBzZWxlY3RlZCBwYXJhbWV0ZXJzXHJcbiAgICAgICAgICAgIHN0YXRlLnBhcmFtcyA9IF8uZXh0ZW5kKHN0YXRlLnBhcmFtcywgcGFyYW1zKTtcclxuXHJcbiAgICAgICAgICAgICRkZWxlZ2F0ZS5nbyhzdGF0ZS5uYW1lLCBzdGF0ZS5wYXJhbXMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICR3aW5kb3cuaGlzdG9yeS5iYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRCYWNrU3RhdGVEZWNvcmF0b3IoJHByb3ZpZGUpIHtcclxuICAgICRwcm92aWRlLmRlY29yYXRvcignJHN0YXRlJywgZGVjb3JhdGVCYWNrU3RhdGVTZXJ2aWNlKTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwUm91dGluZycpXHJcbiAgICAuY29uZmlnKGFkZEJhY2tTdGF0ZURlY29yYXRvcilcclxuICAgIC5ydW4oY2FwdHVyZVN0YXRlVHJhbnNsYXRpb25zKTtcclxuICAgICIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmxldCBSZWRpcmVjdGVkU3RhdGVzOiBhbnkgPSB7fTtcclxuXHJcbmZ1bmN0aW9uIGRlY29yYXRlUmVkaXJlY3RTdGF0ZVByb3ZpZGVyKCRkZWxlZ2F0ZSkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICRkZWxlZ2F0ZS5yZWRpcmVjdCA9IHJlZGlyZWN0O1xyXG5cclxuICAgIHJldHVybiAkZGVsZWdhdGU7XHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAvLyBTcGVjaWZ5IGF1dG9tYXRpYyByZWRpcmVjdCBmcm9tIG9uZSBzdGF0ZSB0byBhbm90aGVyXHJcbiAgICBmdW5jdGlvbiByZWRpcmVjdChmcm9tU3RhdGUsIHRvU3RhdGUpIHtcclxuICAgICAgICBSZWRpcmVjdGVkU3RhdGVzW2Zyb21TdGF0ZV0gPSB0b1N0YXRlOyAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFJlZGlyZWN0U3RhdGVQcm92aWRlckRlY29yYXRvcigkcHJvdmlkZSkge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICRwcm92aWRlLmRlY29yYXRvcignJHN0YXRlJywgZGVjb3JhdGVSZWRpcmVjdFN0YXRlUHJvdmlkZXIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWNvcmF0ZVJlZGlyZWN0U3RhdGVTZXJ2aWNlKCRkZWxlZ2F0ZSwgJHRpbWVvdXQpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAkZGVsZWdhdGUucmVkaXJlY3QgPSByZWRpcmVjdDtcclxuICAgIFxyXG4gICAgcmV0dXJuICRkZWxlZ2F0ZTtcclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICBcclxuICAgIC8vIFRvZG86IE1vdmUgdGhpcyBjb2RlIGRpcmVjdGx5IHRvIGV2ZW50IGhhbmRsZXI/XHJcbiAgICAvLyBUb2RvOiBOb3RoaW5nIGNhbGxzIHRoaXMgY29kZSEhXHJcbiAgICBmdW5jdGlvbiByZWRpcmVjdChldmVudCwgc3RhdGUsIHBhcmFtcykge1xyXG4gICAgICAgIGxldCB0b1N0YXRlID0gUmVkaXJlY3RlZFN0YXRlc1tzdGF0ZS5uYW1lXTtcclxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHRvU3RhdGUpKSB7XHJcbiAgICAgICAgICAgIHRvU3RhdGUgPSB0b1N0YXRlKHN0YXRlLm5hbWUsIHBhcmFtcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXy5pc051bGwodG9TdGF0ZSkpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZGlyZWN0ZWQgdG9TdGF0ZSBjYW5ub3QgYmUgbnVsbCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEhdG9TdGF0ZSkge1xyXG4gICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgJGRlbGVnYXRlLnRyYW5zaXRpb25Ubyh0b1N0YXRlLCBwYXJhbXMsIHtsb2NhdGlvbjogJ3JlcGxhY2UnfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFJlZGlyZWN0U3RhdGVEZWNvcmF0b3IoJHByb3ZpZGUpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRzdGF0ZScsIGRlY29yYXRlUmVkaXJlY3RTdGF0ZVNlcnZpY2UpO1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBSb3V0aW5nJylcclxuICAgIC5jb25maWcoYWRkUmVkaXJlY3RTdGF0ZVByb3ZpZGVyRGVjb3JhdG9yKVxyXG4gICAgLmNvbmZpZyhhZGRSZWRpcmVjdFN0YXRlRGVjb3JhdG9yKTtcclxuICAgICIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBsZXQgUm91dGluZ1Zhcjogc3RyaW5nID0gXCIkcm91dGluZ1wiO1xyXG5cclxuZnVuY3Rpb24gaG9va1JvdXRpbmdFdmVudHMoXHJcbiAgICAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuICAgICRsb2c6IG5nLklMb2dTZXJ2aWNlLFxyXG4gICAgJHN0YXRlOiBuZy51aS5JU3RhdGVTZXJ2aWNlXHJcbikge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsXHJcbiAgICAgICAgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSA9PiB7XHJcbiAgICAgICAgICAgICRyb290U2NvcGVbUm91dGluZ1Zhcl0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLFxyXG4gICAgICAgIChldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykgPT4ge1xyXG4gICAgICAgICAgICAvLyBVbnNldCByb3V0aW5nIHZhcmlhYmxlIHRvIGRpc2FibGUgcGFnZSB0cmFuc2l0aW9uXHJcbiAgICAgICAgICAgICRyb290U2NvcGVbUm91dGluZ1Zhcl0gPSBmYWxzZTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBJbnRlcmNlcHQgcm91dGUgZXJyb3JcclxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsXHJcbiAgICAgICAgKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zLCBlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAvLyBVbnNldCByb3V0aW5nIHZhcmlhYmxlIHRvIGRpc2FibGUgcGFnZSB0cmFuc2l0aW9uXHJcbiAgICAgICAgICAgICRyb290U2NvcGVbUm91dGluZ1Zhcl0gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICRsb2cuZXJyb3IoJ0Vycm9yIHdoaWxlIHN3aXRjaGluZyByb3V0ZSB0byAnICsgdG9TdGF0ZS5uYW1lKTtcclxuICAgICAgICAgICAgJGxvZy5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyBJbnRlcmNlcHQgcm91dGUgZXJyb3JcclxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVOb3RGb3VuZCcsXHJcbiAgICAgICAgZnVuY3Rpb24oZXZlbnQsIHVuZm91bmRTdGF0ZSwgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAkcm9vdFNjb3BlW1JvdXRpbmdWYXJdID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBUb2RvOiBNb3ZlIHRvIGVycm9yc1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2Vycm9yc19taXNzaW5nX3JvdXRlJywgIHtcclxuICAgICAgICAgICAgICAgICAgICB1bmZvdW5kU3RhdGU6IHVuZm91bmRTdGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tU3RhdGUgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBmcm9tU3RhdGUgPyBmcm9tU3RhdGUubmFtZSA6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tUGFyYW1zOiBmcm9tUGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBSb3V0aW5nJylcclxuICAgIC5ydW4oaG9va1JvdXRpbmdFdmVudHMpO1xyXG4gICAgIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcFJvdXRpbmcnLCBbJ3VpLnJvdXRlciddKTtcclxuXHJcbmltcG9ydCAnLi9CYWNrRGVjb3JhdG9yJztcclxuaW1wb3J0ICcuL1JlZGlyZWN0RGVjb3JhdG9yJztcclxuaW1wb3J0ICcuL1JvdXRpbmdFdmVudHMnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9CYWNrRGVjb3JhdG9yJztcclxuZXhwb3J0ICogZnJvbSAnLi9Sb3V0aW5nRXZlbnRzJztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGxldCBJZGVudGl0eVJvb3RWYXIgPSBcIiRpZGVudGl0eVwiO1xyXG5leHBvcnQgbGV0IElkZW50aXR5Q2hhbmdlZEV2ZW50ID0gXCJwaXBJZGVudGl0eUNoYW5nZWRcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUlkZW50aXR5IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBmdWxsX25hbWU6IHN0cmluZztcclxuICAgIGRldGFpbHM6IHN0cmluZztcclxuICAgIGVtYWlsOiBzdHJpbmc7XHJcbiAgICBwaG90b191cmw6IHN0cmluZztcclxuICAgIGdyb3Vwczogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUlkZW50aXR5U2VydmljZSB7XHJcbiAgICBpZGVudGl0eTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElJZGVudGl0eVByb3ZpZGVyIGV4dGVuZHMgbmcuSVNlcnZpY2VQcm92aWRlciB7XHJcbiAgICBzZXRSb290VmFyOiBib29sZWFuO1xyXG4gICAgaWRlbnRpdHk6IGFueTtcclxufVxyXG5cclxuXHJcbmNsYXNzIElkZW50aXR5U2VydmljZSBpbXBsZW1lbnRzIElJZGVudGl0eVNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfaWRlbnRpdHk6IGFueTtcclxuICAgIHByaXZhdGUgX3NldFJvb3RWYXI6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfbG9nOiBuZy5JTG9nU2VydmljZTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICAgICAgc2V0Um9vdFZhcjogYm9vbGVhbixcclxuICAgICAgICBpZGVudGl0eTogYW55LFxyXG4gICAgICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICRsb2c6IG5nLklMb2dTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9zZXRSb290VmFyID0gc2V0Um9vdFZhcjtcclxuICAgICAgICB0aGlzLl9pZGVudGl0eSA9IGlkZW50aXR5O1xyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5fbG9nID0gJGxvZztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRSb290VmFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRSb290VmFyKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9zZXRSb290VmFyKVxyXG4gICAgICAgICAgICB0aGlzLl9yb290U2NvcGVbSWRlbnRpdHlSb290VmFyXSA9IHRoaXMuX2lkZW50aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaWRlbnRpdHkoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWRlbnRpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBpZGVudGl0eSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5faWRlbnRpdHkgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnNldFJvb3RWYXIoKTtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUuJGVtaXQoSWRlbnRpdHlDaGFuZ2VkRXZlbnQsIHRoaXMuX2lkZW50aXR5KTtcclxuXHJcbiAgICAgICAgbGV0IGlkZW50aXR5OiBhbnkgPSB2YWx1ZSB8fCB7fTtcclxuICAgICAgICB0aGlzLl9sb2cuZGVidWcoXCJDaGFuZ2VkIGlkZW50aXR5IHRvIFwiICsgSlNPTi5zdHJpbmdpZnkoaWRlbnRpdHkpKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgSWRlbnRpdHlQcm92aWRlciBpbXBsZW1lbnRzIElkZW50aXR5UHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfc2V0Um9vdFZhciA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9pZGVudGl0eTogYW55ID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3NlcnZpY2U6IElkZW50aXR5U2VydmljZSA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gICAgcHVibGljIGdldCBzZXRSb290VmFyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRSb290VmFyOyAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzZXRSb290VmFyKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0Um9vdFZhciA9ICEhdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpZGVudGl0eSgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZGVudGl0eTsgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgaWRlbnRpdHkodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX2lkZW50aXR5ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRnZXQoXHJcbiAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgJGxvZzogbmcuSUxvZ1NlcnZpY2VcclxuICAgICk6IGFueSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VydmljZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlID0gbmV3IElkZW50aXR5U2VydmljZSh0aGlzLl9zZXRSb290VmFyLCB0aGlzLl9pZGVudGl0eSwgJHJvb3RTY29wZSwgJGxvZyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwU2Vzc2lvbicpXHJcbiAgICAucHJvdmlkZXIoJ3BpcElkZW50aXR5JywgSWRlbnRpdHlQcm92aWRlcik7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjb25zdCBTZXNzaW9uUm9vdFZhciA9IFwiJHNlc3Npb25cIjtcclxuZXhwb3J0IGNvbnN0IFNlc3Npb25PcGVuZWRFdmVudCA9IFwicGlwU2Vzc2lvbk9wZW5lZFwiO1xyXG5leHBvcnQgY29uc3QgU2Vzc2lvbkNsb3NlZEV2ZW50ID0gXCJwaXBTZXNzaW9uQ2xvc2VkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTZXNzaW9uU2VydmljZSB7XHJcbiAgICBzZXNzaW9uOiBhbnk7XHJcbiAgICBpc09wZW5lZCgpOiBib29sZWFuO1xyXG5cclxuICAgIG9wZW4oc2Vzc2lvbjogYW55KTogdm9pZDtcclxuICAgIGNsb3NlKCk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNlc3Npb25Qcm92aWRlciBleHRlbmRzIG5nLklTZXJ2aWNlUHJvdmlkZXIge1xyXG4gICAgc2V0Um9vdFZhcjogYm9vbGVhbjtcclxuICAgIHNlc3Npb246IGFueTtcclxufVxyXG5cclxuY2xhc3MgU2Vzc2lvblNlcnZpY2UgaW1wbGVtZW50cyBJU2Vzc2lvblNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfc2V0Um9vdFZhcjogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3Nlc3Npb246IGFueTtcclxuICAgIHByaXZhdGUgX3Jvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9sb2c6IG5nLklMb2dTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICBzZXRSb290VmFyOiBib29sZWFuLCBcclxuICAgICAgICBzZXNzaW9uOiBhbnksIFxyXG4gICAgICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICRsb2c6IG5nLklMb2dTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9zZXRSb290VmFyID0gc2V0Um9vdFZhcjtcclxuICAgICAgICB0aGlzLl9zZXNzaW9uID0gc2Vzc2lvbjtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuX2xvZyA9ICRsb2c7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Um9vdFZhcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIHNldFJvb3RWYXIoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NldFJvb3RWYXIpXHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RTY29wZVtTZXNzaW9uUm9vdFZhcl0gPSB0aGlzLl9zZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2Vzc2lvbigpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXNzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpc09wZW5lZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2Vzc2lvbiAhPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKHNlc3Npb246IGFueSwgZnVsbFJlc2V0OiBib29sZWFuID0gZmFsc2UsIHBhcnRpYWxSZXNldDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHNlc3Npb24gPT0gbnVsbClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2Vzc2lvbiBjYW5ub3QgYmUgbnVsbFwiKTtcclxuXHJcbiAgICAgICAgdGhpcy5fc2Vzc2lvbiA9IHNlc3Npb247XHJcbiAgICAgICAgdGhpcy5zZXRSb290VmFyKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRlbWl0KFNlc3Npb25PcGVuZWRFdmVudCwgc2Vzc2lvbik7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZy5kZWJ1ZyhcIk9wZW5lZCBzZXNzaW9uIFwiICsgc2Vzc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKGZ1bGxSZXNldDogYm9vbGVhbiA9IGZhbHNlLCBwYXJ0aWFsUmVzZXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBvbGRTZXNzaW9uID0gdGhpcy5fc2Vzc2lvbjtcclxuXHJcbiAgICAgICAgdGhpcy5fc2Vzc2lvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zZXRSb290VmFyKCk7XHJcbiAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRlbWl0KFNlc3Npb25DbG9zZWRFdmVudCwgb2xkU2Vzc2lvbik7XHJcblxyXG4gICAgICAgIHRoaXMuX2xvZy5kZWJ1ZyhcIkNsb3NlZCBzZXNzaW9uIFwiICsgb2xkU2Vzc2lvbik7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIFNlc3Npb25Qcm92aWRlciBpbXBsZW1lbnRzIElTZXNzaW9uUHJvdmlkZXIge1xyXG4gICAgcHJpdmF0ZSBfc2V0Um9vdFZhciA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9zZXNzaW9uOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfc2VydmljZTogU2Vzc2lvblNlcnZpY2UgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2V0Um9vdFZhcigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2V0Um9vdFZhcjsgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2V0Um9vdFZhcih2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3NldFJvb3RWYXIgPSAhIXZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2Vzc2lvbigpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXNzaW9uOyAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzZXNzaW9uKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9zZXNzaW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRnZXQoXHJcbiAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgJGxvZzogbmcuSUxvZ1NlcnZpY2VcclxuICAgICk6IGFueSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2VydmljZSA9PSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlID0gbmV3IFNlc3Npb25TZXJ2aWNlKHRoaXMuX3NldFJvb3RWYXIsIHRoaXMuX3Nlc3Npb24sICRyb290U2NvcGUsICRsb2cpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VydmljZTtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwU2Vzc2lvbicpXHJcbiAgICAucHJvdmlkZXIoJ3BpcFNlc3Npb24nLCBTZXNzaW9uUHJvdmlkZXIpOyBcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcFNlc3Npb24nLCBbXSk7XHJcblxyXG5pbXBvcnQgJy4vSWRlbnRpdHlTZXJ2aWNlJztcclxuaW1wb3J0ICcuL1Nlc3Npb25TZXJ2aWNlJztcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vSWRlbnRpdHlTZXJ2aWNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9TZXNzaW9uU2VydmljZSc7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IFRyYW5zYWN0aW9uRXJyb3IgfSBmcm9tICcuL1RyYW5zYWN0aW9uRXJyb3InXHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNhY3Rpb24ge1xyXG4gICAgcHJpdmF0ZSBfc2NvcGU6IHN0cmluZyA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9pZDogc3RyaW5nID0gbnVsbDtcclxuICAgIHByaXZhdGUgX29wZXJhdGlvbjogc3RyaW5nID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2Vycm9yOiBUcmFuc2FjdGlvbkVycm9yID0gbmV3IFRyYW5zYWN0aW9uRXJyb3IoKTtcclxuICAgIHByaXZhdGUgX3Byb2dyZXNzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihzY29wZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5fc2NvcGUgPSBzY29wZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNjb3BlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njb3BlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgaWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvcGVyYXRpb24oKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3BlcmF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcHJvZ3Jlc3MoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZ3Jlc3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBlcnJvcigpOiBUcmFuc2FjdGlvbkVycm9yIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBlcnJvck1lc3NhZ2UoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3IubWVzc2FnZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX29wZXJhdGlvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgIHRoaXMuX2Vycm9yLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJ1c3koKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkICE9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZhaWxlZCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gIXRoaXMuX2Vycm9yLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFib3J0ZWQoaWQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZCAhPSBpZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmVnaW4ob3BlcmF0aW9uOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIFRyYW5zYWN0aW9uIGlzIGFscmVhZHkgcnVubmluZ1xyXG4gICAgICAgIGlmICh0aGlzLl9pZCAhPSBudWxsKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5faWQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKS50b1N0cmluZygpO1xyXG4gICAgICAgIHRoaXMuX29wZXJhdGlvbiA9IG9wZXJhdGlvbiB8fCAnUFJPQ0VTU0lORydcclxuICAgICAgICB0aGlzLl9lcnJvci5yZXNldCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZShwcm9ncmVzczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3Jlc3MgPSBNYXRoLm1heChwcm9ncmVzcywgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWJvcnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2Vycm9yLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVuZChlcnJvcj86IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2Vycm9yLmRlY29kZShlcnJvcik7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2FjdGlvbkVycm9yIHtcclxuICAgIHB1YmxpYyBjb2RlOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGRldGFpbHM6IGFueTtcclxuICAgIHB1YmxpYyBjYXVzZTogc3RyaW5nO1xyXG4gICAgcHVibGljIHN0YWNrX3RyYWNlOiBzdHJpbmc7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKGVycm9yPzogYW55KSB7XHJcbiAgICAgICAgaWYgKGVycm9yICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuZGVjb2RlKGVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jb2RlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZGV0YWlscyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jYXVzZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGFja190cmFjZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UgPSBudWxsICYmIHRoaXMuY29kZSA9PSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZWNvZGUoZXJyb3I6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVzZXQoKTtcclxuXHJcbiAgICAgICAgaWYgKGVycm9yID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gUHJvY2VzcyByZWd1bGFyIG1lc3NhZ2VzXHJcbiAgICAgICAgaWYgKGVycm9yLm1lc3NhZ2UpIFxyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xyXG5cclxuICAgICAgICAvLyBQcm9jZXNzIHNlcnZlciBhcHBsaWNhdGlvbiBlcnJvcnNcclxuICAgICAgICBpZiAoZXJyb3IuZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IuZGF0YS5jb2RlKSB7IFxyXG4gICAgICAgICAgICAgICAgLy8gcHJvY2VzcyBzZXJ2ZXIgZXJyb3IgY29kZXMgaGVyZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gdGhpcy5tZXNzYWdlIHx8ICdFUlJPUl8nICsgZXJyb3IuZGF0YS5jb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2RlID0gdGhpcy5jb2RlIHx8IGVycm9yLmRhdGEuY29kZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGVycm9yLmRhdGEubWVzc2FnZSlcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9IHRoaXMubWVzc2FnZSB8fCBlcnJvci5kYXRhLm1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2UgfHwgZXJyb3IuZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5kZXRhaWxzID0gdGhpcy5kZXRhaWxzIHx8IGVycm9yLmRhdGE7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhdXNlID0gZXJyb3IuZGF0YS5jYXVzZTtcclxuICAgICAgICAgICAgdGhpcy5zdGFja190cmFjZSA9IGVycm9yLmRhdGEuc3RhY2tfdHJhY2U7XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlscyA9IGVycm9yLmRhdGEuZGV0YWlsczsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFByb2Nlc3Mgc3RhbmRhcmQgSFRUUCBlcnJvcnNcclxuICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzVGV4dClcclxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gdGhpcy5tZXNzYWdlIHx8IGVycm9yLnN0YXR1c1RleHQ7XHJcblxyXG4gICAgICAgIGlmIChlcnJvci5zdGF0dXMpIHtcclxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlID0gdGhpcy5tZXNzYWdlIHx8ICdFUlJPUl8nICsgZXJyb3Iuc3RhdHVzO1xyXG4gICAgICAgICAgICB0aGlzLmNvZGUgPSB0aGlzLmNvZGUgfHwgZXJyb3Iuc3RhdHVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2UgfHwgZXJyb3I7XHJcbiAgICAgICAgdGhpcy5kZXRhaWxzID0gdGhpcy5kZXRhaWxzIHx8IGVycm9yO1xyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCB7IFRyYW5zYWN0aW9uIH0gZnJvbSAnLi9UcmFuc2FjdGlvbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2FjdGlvblNlcnZpY2Uge1xyXG4gICAgY3JlYXRlKHNjb3BlPzogc3RyaW5nKTogVHJhbnNhY3Rpb247XHJcbiAgICBnZXQoc2NvcGU/OiBzdHJpbmcpOiBUcmFuc2FjdGlvbjtcclxufVxyXG5cclxuY2xhc3MgVHJhbnNhY3Rpb25TZXJ2aWNlIGltcGxlbWVudHMgSVRyYW5zYWN0aW9uU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF90cmFuc2FjdGlvbnM6IGFueSA9IHt9O1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZShzY29wZT86IHN0cmluZyk6IFRyYW5zYWN0aW9uIHtcclxuICAgICAgICBsZXQgdHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24oc2NvcGUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChzY29wZSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2FjdGlvbnNbc2NvcGVdID0gdHJhbnNhY3Rpb247XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFuc2FjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0KHNjb3BlPzogc3RyaW5nKTogVHJhbnNhY3Rpb24ge1xyXG4gICAgICAgIGxldCB0cmFuc2FjdGlvbjogVHJhbnNhY3Rpb24gPSBzY29wZSAhPSBudWxsID8gPFRyYW5zYWN0aW9uPnRoaXMuX3RyYW5zYWN0aW9uc1tzY29wZV0gOiBudWxsO1xyXG5cclxuICAgICAgICBpZiAodHJhbnNhY3Rpb24gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0cmFuc2FjdGlvbiA9IG5ldyBUcmFuc2FjdGlvbihzY29wZSk7XHJcbiAgICAgICAgICAgIGlmIChzY29wZSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhbnNhY3Rpb25zW3Njb3BlXSA9IHRyYW5zYWN0aW9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uO1xyXG4gICAgfVxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBUcmFuc2FjdGlvbicpXHJcbiAgICAuc2VydmljZSgncGlwVHJhbnNhY3Rpb24nLCBUcmFuc2FjdGlvblNlcnZpY2UpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBjb25maWd1cmVUcmFuc2FjdGlvblN0cmluZ3MoJGluamVjdG9yKSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgbGV0IHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZVByb3ZpZGVyJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGVQcm92aWRlcicpIDogbnVsbDtcclxuXHJcbiAgICBpZiAocGlwVHJhbnNsYXRlKSB7XHJcbiAgICAgICAgcGlwVHJhbnNsYXRlLnNldFRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgICAgICdFTlRFUklORyc6ICdFbnRlcmluZy4uLicsXHJcbiAgICAgICAgICAgICdQUk9DRVNTSU5HJzogJ1Byb2Nlc3NpbmcuLi4nLFxyXG4gICAgICAgICAgICAnTE9BRElORyc6ICdMb2FkaW5nLi4uJyxcclxuICAgICAgICAgICAgJ1NBVklORyc6ICdTYXZpbmcuLi4nXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBpcFRyYW5zbGF0ZS5zZXRUcmFuc2xhdGlvbnMoJ3J1Jywge1xyXG4gICAgICAgICAgICAnRU5URVJJTkcnOiAn0JLRhdC+0LQg0LIg0YHQuNGB0YLQtdC80YMuLi4nLFxyXG4gICAgICAgICAgICAnUFJPQ0VTU0lORyc6ICfQntCx0YDQsNCx0LDRgtGL0LLQsNC10YLRgdGPLi4uJyxcclxuICAgICAgICAgICAgJ0xPQURJTkcnOiAn0JfQsNCz0YDRg9C20LDQtdGC0YHRjy4uLicsXHJcbiAgICAgICAgICAgICdTQVZJTkcnOiAn0KHQvtGF0YDQsNC90Y/QtdGC0YHRjy4uLidcclxuICAgICAgICB9KTsgICBcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBUcmFuc2FjdGlvbicpXHJcbiAgICAuY29uZmlnKGNvbmZpZ3VyZVRyYW5zYWN0aW9uU3RyaW5ncyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBUcmFuc2FjdGlvbicsIFtdKTtcclxuXHJcbmltcG9ydCAnLi9UcmFuc2FjdGlvblN0cmluZ3MnO1xyXG5pbXBvcnQgJy4vVHJhbnNhY3Rpb25FcnJvcic7XHJcbmltcG9ydCAnLi9UcmFuc2FjdGlvbic7XHJcbmltcG9ydCAnLi9UcmFuc2FjdGlvblNlcnZpY2UnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9UcmFuc2FjdGlvbkVycm9yJztcclxuZXhwb3J0ICogZnJvbSAnLi9UcmFuc2FjdGlvbic7XHJcbmV4cG9ydCAqIGZyb20gJy4vVHJhbnNhY3Rpb25TZXJ2aWNlJztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gdHJhbnNsYXRlRGlyZWN0aXZlKHBpcFRyYW5zbGF0ZSk6IG5nLklEaXJlY3RpdmUge1xyXG4gICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAga2V5MTogJ0BwaXBUcmFuc2xhdGUnLFxyXG4gICAgICAgICAgICBrZXkyOiAnQGtleSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbms6IChzY29wZTogYW55LCBlbGVtZW50OiBhbnksIGF0dHJzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IHNjb3BlLmtleTEgfHwgc2NvcGUua2V5MjtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnRleHQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRyYW5zbGF0ZUh0bWxEaXJlY3RpdmUocGlwVHJhbnNsYXRlKTogbmcuSURpcmVjdGl2ZSB7XHJcbiAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICBrZXkxOiAnQHBpcFRyYW5zbGF0ZUh0bWwnLFxyXG4gICAgICAgICAgICBrZXkyOiAnQGtleSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpbms6IChzY29wZTogYW55LCBlbGVtZW50OiBhbnksIGF0dHJzOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IHNjb3BlLmtleTEgfHwgc2NvcGUua2V5MjtcclxuICAgICAgICAgICAgbGV0IHZhbHVlID0gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpO1xyXG4gICAgICAgICAgICBlbGVtZW50Lmh0bWwodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcFRyYW5zbGF0ZScpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBUcmFuc2xhdGUnLCB0cmFuc2xhdGVEaXJlY3RpdmUpXHJcbiAgICAuZGlyZWN0aXZlKCdwaXBUcmFuc2xhdGVIdG1sJywgdHJhbnNsYXRlSHRtbERpcmVjdGl2ZSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIHRyYW5zbGF0ZUZpbHRlcihwaXBUcmFuc2xhdGUpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUudHJhbnNsYXRlKGtleSkgfHwga2V5O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBvcHRpb25hbFRyYW5zbGF0ZUZpbHRlcigkaW5qZWN0b3IpIHtcclxuICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICBsZXQgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgXHJcbiAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlICA/IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUoa2V5KSB8fCBrZXkgOiBrZXk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcFRyYW5zbGF0ZScpXHJcbiAgICAuZmlsdGVyKCd0cmFuc2xhdGUnLCB0cmFuc2xhdGVGaWx0ZXIpO1xyXG4iLCLvu78ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgeyBUcmFuc2xhdGlvbiB9IGZyb20gJy4vVHJhbnNsYXRpb24nO1xyXG5pbXBvcnQgeyBSZXNldFBhZ2VFdmVudCB9IGZyb20gJy4uL3V0aWxpdGllcy9QYWdlUmVzZXRTZXJ2aWNlJztcclxuXHJcbmV4cG9ydCBsZXQgTGFuZ3VhZ2VSb290VmFyID0gXCIkbGFuZ3VhZ2VcIjtcclxuZXhwb3J0IGxldCBMYW5ndWFnZUNoYW5nZWRFdmVudCA9IFwicGlwTGFuZ3VhZ2VDaGFuZ2VkXCI7ICAgIFxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVHJhbnNsYXRlU2VydmljZSB7XHJcbiAgICBsYW5ndWFnZTogc3RyaW5nO1xyXG5cclxuICAgIHVzZShsYW5ndWFnZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgc2V0VHJhbnNsYXRpb25zKGxhbmd1YWdlOiBzdHJpbmcsIHRyYW5zbGF0aW9uczogYW55KTogdm9pZDtcclxuICAgIHRyYW5zbGF0aW9ucyhsYW5ndWFnZTogc3RyaW5nLCB0cmFuc2xhdGlvbnM6IGFueSk6IHZvaWQ7XHJcblxyXG4gICAgdHJhbnNsYXRlKGtleTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgdHJhbnNsYXRlQXJyYXkoa2V5czogc3RyaW5nW10pOiBzdHJpbmdbXTtcclxuICAgIHRyYW5zbGF0ZVNldChrZXlzOiBzdHJpbmdbXSwga2V5UHJvcDogc3RyaW5nLCB2YWx1ZVByb3A6IHN0cmluZyk6IGFueVtdO1xyXG4gICAgdHJhbnNsYXRlT2JqZWN0cyhpdGVtczogYW55W10sIGtleVByb3A6IHN0cmluZywgdmFsdWVQcm9wOiBzdHJpbmcpOiBhbnlbXTtcclxuICAgIHRyYW5zbGF0ZVdpdGhQcmVmaXgocHJlZml4OiBzdHJpbmcsIGtleTogc3RyaW5nKTtcclxuICAgIHRyYW5zbGF0ZVNldFdpdGhQcmVmaXgocHJlZml4OiBzdHJpbmcsIGtleXM6IHN0cmluZ1tdLCBrZXlQcm9wOiBzdHJpbmcsIHZhbHVlUHJvcDogc3RyaW5nKTtcclxuICAgIHRyYW5zbGF0ZVNldFdpdGhQcmVmaXgyKHByZWZpeDogc3RyaW5nLCBrZXlzOiBzdHJpbmdbXSwga2V5UHJvcDogc3RyaW5nLCB2YWx1ZVByb3A6IHN0cmluZyk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVRyYW5zbGF0ZVByb3ZpZGVyIGV4dGVuZHMgSVRyYW5zbGF0ZVNlcnZpY2UsIG5nLklTZXJ2aWNlUHJvdmlkZXIge1xyXG59XHJcblxyXG5jbGFzcyBUcmFuc2xhdGVTZXJ2aWNlIGltcGxlbWVudHMgSVRyYW5zbGF0ZVNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfdHJhbnNsYXRpb246IFRyYW5zbGF0aW9uO1xyXG4gICAgcHJpdmF0ZSBfc2V0Um9vdFZhcjogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3BlcnNpc3Q6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfbG9nOiBuZy5JTG9nU2VydmljZTtcclxuICAgIHByaXZhdGUgX3dpbmRvdzogbmcuSVdpbmRvd1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9tZERhdGVMb2NhbGU7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHRyYW5zbGF0aW9uOiBUcmFuc2xhdGlvbixcclxuICAgICAgICBzZXRSb290VmFyOiBib29sZWFuLFxyXG4gICAgICAgIHBlcnNpc3Q6IGJvb2xlYW4sXHJcbiAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgJGxvZzogbmcuSUxvZ1NlcnZpY2UsXHJcbiAgICAgICAgJHdpbmRvdzogbmcuSVdpbmRvd1NlcnZpY2UsXHJcbiAgICAgICAgJG1kRGF0ZUxvY2FsZTogYW5ndWxhci5tYXRlcmlhbC5JRGF0ZUxvY2FsZVByb3ZpZGVyLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0Um9vdFZhciA9IHNldFJvb3RWYXI7XHJcbiAgICAgICAgdGhpcy5fcGVyc2lzdCA9IHBlcnNpc3Q7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNsYXRpb24gPSB0cmFuc2xhdGlvbjtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuX2xvZyA9ICRsb2c7XHJcbiAgICAgICAgdGhpcy5fd2luZG93ID0gJHdpbmRvdztcclxuICAgICAgICB0aGlzLl9tZERhdGVMb2NhbGUgPSAkbWREYXRlTG9jYWxlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fcGVyc2lzdCAmJiB0aGlzLl93aW5kb3cubG9jYWxTdG9yYWdlKVxyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2xhdGlvbi5sYW5ndWFnZSA9IHRoaXMuX3dpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbGFuZ3VhZ2UnKSB8fCB0aGlzLl90cmFuc2xhdGlvbi5sYW5ndWFnZTtcclxuXHJcbiAgICAgICAgdGhpcy5fbG9nLmRlYnVnKFwiU2V0IGxhbmd1YWdlIHRvIFwiICsgdGhpcy5fdHJhbnNsYXRpb24ubGFuZ3VhZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLnNhdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoYW5nZUxvY2FsZShsb2NhbGU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghbG9jYWxlKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIHZhciBsb2NhbGVEYXRlOiBtb21lbnQuTW9tZW50TGFuZ3VhZ2VEYXRhO1xyXG4gICAgICAgIHZhciBsb2NhbGVEYXRlOiBhbnk7XHJcblxyXG4gICAgICAgIG1vbWVudC5sb2NhbGUobG9jYWxlKTtcclxuICAgICAgICBsb2NhbGVEYXRlID0gbW9tZW50LmxvY2FsZURhdGEoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWREYXRlTG9jYWxlLm1vbnRocyA9IGFuZ3VsYXIuaXNBcnJheShsb2NhbGVEYXRlLl9tb250aHMpID8gbG9jYWxlRGF0ZS5fbW9udGhzIDogbG9jYWxlRGF0ZS5fbW9udGhzLmZvcm1hdDtcclxuICAgICAgICB0aGlzLl9tZERhdGVMb2NhbGUuc2hvcnRNb250aHMgPSBhbmd1bGFyLmlzQXJyYXkobG9jYWxlRGF0ZS5fbW9udGhzU2hvcnQpID8gbG9jYWxlRGF0ZS5fbW9udGhzU2hvcnQgOiBsb2NhbGVEYXRlLl9tb250aHNTaG9ydC5mb3JtYXQ7XHJcbiAgICAgICAgdGhpcy5fbWREYXRlTG9jYWxlLmRheXMgPSBhbmd1bGFyLmlzQXJyYXkobG9jYWxlRGF0ZS5fd2Vla2RheXMpID8gbG9jYWxlRGF0ZS5fd2Vla2RheXMgOiBsb2NhbGVEYXRlLl93ZWVrZGF5cy5mb3JtYXQ7XHJcbiAgICAgICAgdGhpcy5fbWREYXRlTG9jYWxlLnNob3J0RGF5cyA9IGxvY2FsZURhdGUuX3dlZWtkYXlzTWluO1xyXG4gICAgICAgIHRoaXMuX21kRGF0ZUxvY2FsZS5maXJzdERheU9mV2VlayA9IGxvY2FsZURhdGUuX3dlZWsuZG93O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fc2V0Um9vdFZhcilcclxuICAgICAgICAgICAgdGhpcy5fcm9vdFNjb3BlW0xhbmd1YWdlUm9vdFZhcl0gPSB0aGlzLl90cmFuc2xhdGlvbi5sYW5ndWFnZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3BlcnNpc3QgJiYgdGhpcy5fd2luZG93LmxvY2FsU3RvcmFnZSAhPSBudWxsKVxyXG4gICAgICAgICAgICB0aGlzLl93aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2xhbmd1YWdlJywgdGhpcy5fdHJhbnNsYXRpb24ubGFuZ3VhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbGFuZ3VhZ2UoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb24ubGFuZ3VhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBsYW5ndWFnZSh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9IHRoaXMuX3RyYW5zbGF0aW9uLmxhbmd1YWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uLmxhbmd1YWdlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLl9sb2cuZGVidWcoXCJDaGFuZ2luZyBsYW5ndWFnZSB0byBcIiArIHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlTG9jYWxlKHRoaXMuX3RyYW5zbGF0aW9uLmxhbmd1YWdlKTtcclxuICAgICAgICAgICAgdGhpcy5zYXZlKCk7ICAgXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yb290U2NvcGUuJGVtaXQoTGFuZ3VhZ2VDaGFuZ2VkRXZlbnQsIHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdFNjb3BlLiRlbWl0KFJlc2V0UGFnZUV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVzZShsYW5ndWFnZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAobGFuZ3VhZ2UgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5sYW5ndWFnZSA9IGxhbmd1YWdlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUcmFuc2xhdGlvbnMobGFuZ3VhZ2U6IHN0cmluZywgdHJhbnNsYXRpb25zOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb24uc2V0VHJhbnNsYXRpb25zKGxhbmd1YWdlLCB0cmFuc2xhdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGlvbnMobGFuZ3VhZ2U6IHN0cmluZywgdHJhbnNsYXRpb25zOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNsYXRpb24uc2V0VHJhbnNsYXRpb25zKGxhbmd1YWdlLCB0cmFuc2xhdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGUoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbi50cmFuc2xhdGUoa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlQXJyYXkoa2V5czogc3RyaW5nW10pOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uLnRyYW5zbGF0ZUFycmF5KGtleXMpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlU2V0KGtleXM6IHN0cmluZ1tdLCBrZXlQcm9wOiBzdHJpbmcsIHZhbHVlUHJvcDogc3RyaW5nKTogYW55W10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbi50cmFuc2xhdGVTZXQoa2V5cywga2V5UHJvcCwgdmFsdWVQcm9wKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlT2JqZWN0cyhpdGVtczogYW55W10sIGtleVByb3A6IHN0cmluZywgdmFsdWVQcm9wOiBzdHJpbmcpOiBhbnlbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uLnRyYW5zbGF0ZU9iamVjdHMoaXRlbXMsIGtleVByb3AsIHZhbHVlUHJvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZVdpdGhQcmVmaXgocHJlZml4OiBzdHJpbmcsIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uLnRyYW5zbGF0ZVdpdGhQcmVmaXgocHJlZml4LCBrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB0cmFuc2xhdGVTZXRXaXRoUHJlZml4KHByZWZpeDogc3RyaW5nLCBrZXlzOiBzdHJpbmdbXSwga2V5UHJvcDogc3RyaW5nLCB2YWx1ZVByb3A6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc2xhdGlvbi50cmFuc2xhdGVTZXRXaXRoUHJlZml4KHByZWZpeCwga2V5cywga2V5UHJvcCwgdmFsdWVQcm9wKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlU2V0V2l0aFByZWZpeDIocHJlZml4OiBzdHJpbmcsIGtleXM6IHN0cmluZ1tdLCBrZXlQcm9wOiBzdHJpbmcsIHZhbHVlUHJvcDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zbGF0aW9uLnRyYW5zbGF0ZVNldFdpdGhQcmVmaXgyKHByZWZpeCwga2V5cywga2V5UHJvcCwgdmFsdWVQcm9wKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgVHJhbnNsYXRlUHJvdmlkZXIgZXh0ZW5kcyBUcmFuc2xhdGlvbiBpbXBsZW1lbnRzIElUcmFuc2xhdGVQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF90cmFuc2xhdGlvbjogVHJhbnNsYXRpb247XHJcbiAgICBwcml2YXRlIF9zZXRSb290VmFyOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX3BlcnNpc3Q6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHJpdmF0ZSBfc2VydmljZTogVHJhbnNsYXRlU2VydmljZTtcclxuICAgIFxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzZXRSb290VmFyKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXRSb290VmFyOyAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzZXRSb290VmFyKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0Um9vdFZhciA9ICEhdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBwZXJzaXN0KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wZXJzaXN0OyAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBwZXJzaXN0KHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5fcGVyc2lzdCA9ICEhdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRnZXQoXHJcbiAgICAgICAgJHJvb3RTY29wZTogbmcuSVJvb3RTY29wZVNlcnZpY2UsXHJcbiAgICAgICAgJGxvZzogbmcuSUxvZ1NlcnZpY2UsIFxyXG4gICAgICAgICR3aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlLFxyXG4gICAgICAgICRtZERhdGVMb2NhbGU6IGFuZ3VsYXIubWF0ZXJpYWwuSURhdGVMb2NhbGVQcm92aWRlclxyXG4gICAgKTogYW55IHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZXJ2aWNlID09IG51bGwpIFxyXG4gICAgICAgICAgICB0aGlzLl9zZXJ2aWNlID0gbmV3IFRyYW5zbGF0ZVNlcnZpY2UodGhpcywgdGhpcy5fc2V0Um9vdFZhciwgdGhpcy5fcGVyc2lzdCwgJHJvb3RTY29wZSwgJGxvZywgJHdpbmRvdywgJG1kRGF0ZUxvY2FsZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0VHJhbnNsYXRlKHBpcFRyYW5zbGF0ZTogSVRyYW5zbGF0ZVNlcnZpY2UpIHtcclxuICAgIHBpcFRyYW5zbGF0ZS5sYW5ndWFnZTtcclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwVHJhbnNsYXRlJylcclxuICAgIC5wcm92aWRlcigncGlwVHJhbnNsYXRlJywgVHJhbnNsYXRlUHJvdmlkZXIpXHJcbiAgICAucnVuKGluaXRUcmFuc2xhdGUpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRpb24ge1xyXG4gICAgcHJvdGVjdGVkIF9sYW5ndWFnZSA9ICdlbic7XHJcbiAgICBwcm90ZWN0ZWQgX3RyYW5zbGF0aW9ucyA9IHtcclxuICAgICAgICBlbjoge1xyXG4gICAgICAgICAgICAnZW4nOiAnRW5nbGlzaCcsXHJcbiAgICAgICAgICAgICdydSc6ICdSdXNzaWFuJyxcclxuICAgICAgICAgICAgJ2VzJzogJ1NwYW5pc2gnLFxyXG4gICAgICAgICAgICAncHQnOiAnUG9ydHVndWVzZScsXHJcbiAgICAgICAgICAgICdkZSc6ICdHZXJtYW4nLFxyXG4gICAgICAgICAgICAnZnInOiAnRnJlbmNoJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcnU6IHtcclxuICAgICAgICAgICAgJ2VuJzogJ9CQ0L3Qs9C70LjQudGB0LrQuNC5JyxcclxuICAgICAgICAgICAgJ3J1JzogJ9Cg0YPRgdGB0LrQuNC5JyxcclxuICAgICAgICAgICAgJ2VzJzogJ9CY0YHQv9Cw0L3RgdC60LjQuScsXHJcbiAgICAgICAgICAgICdwdCc6ICfQn9C+0YDRgtGD0LPQsNC70YzRgdC60LjQuScsXHJcbiAgICAgICAgICAgICdkZSc6ICfQndC10LzQtdGG0LrQuNC5JyxcclxuICAgICAgICAgICAgJ2ZyJzogJ9Ck0YDQsNC90YbRg9C30YHQutC40LknXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKSB7fVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbGFuZ3VhZ2UoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2xhbmd1YWdlOyB9XHJcbiAgICBwdWJsaWMgc2V0IGxhbmd1YWdlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fbGFuZ3VhZ2UgPSB2YWx1ZTsgfVxyXG5cclxuICAgIHB1YmxpYyB1c2UobGFuZ3VhZ2U6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKGxhbmd1YWdlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuX2xhbmd1YWdlID0gbGFuZ3VhZ2U7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhbmd1YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFNldCB0cmFuc2xhdGlvbiBzdHJpbmdzIGZvciBzcGVjaWZpYyBsYW5ndWFnZVxyXG4gICAgcHVibGljIHNldFRyYW5zbGF0aW9ucyhsYW5ndWFnZTogc3RyaW5nLCB0cmFuc2xhdGlvbnM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBtYXAgPSB0aGlzLl90cmFuc2xhdGlvbnNbbGFuZ3VhZ2VdIHx8IHt9O1xyXG4gICAgICAgIHRoaXMuX3RyYW5zbGF0aW9uc1tsYW5ndWFnZV0gPSBfLmV4dGVuZChtYXAsIHRyYW5zbGF0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gWWV0IGFub3RoZXIgbWV0aG9kIHRvIHNldCB0cmFuc2xhdGlvbiBzdHJpbmdzIGZvciBzcGVjaWZpYyBsYW5ndWFnZVxyXG4gICAgcHVibGljIHRyYW5zbGF0aW9ucyhsYW5ndWFnZTogc3RyaW5nLCB0cmFuc2xhdGlvbnM6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2V0VHJhbnNsYXRpb25zKGxhbmd1YWdlLCB0cmFuc2xhdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zbGF0ZSBhIHN0cmluZyBieSBrZXkgdXNpbmcgc2V0IGxhbmd1YWdlXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlKGtleTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoXy5pc051bGwoa2V5KSB8fCBfLmlzVW5kZWZpbmVkKGtleSkpIHJldHVybiAnJztcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9ucyA9IHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sYW5ndWFnZV0gfHwge307XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uc1trZXldIHx8IGtleTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2xhdGUgYW4gYXJyYXkgb2Ygc3RyaW5nc1xyXG4gICAgcHVibGljIHRyYW5zbGF0ZUFycmF5KGtleXM6IHN0cmluZ1tdKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGlmIChfLmlzTnVsbChrZXlzKSB8fCBrZXlzLmxlbmd0aCA9PSAwKSByZXR1cm4gW107XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZXMgPSBbXTtcclxuICAgICAgICBsZXQgdHJhbnNsYXRpb25zID0gdGhpcy5fdHJhbnNsYXRpb25zW3RoaXMuX2xhbmd1YWdlXSB8fCB7fTtcclxuXHJcbiAgICAgICAgXy5lYWNoKGtleXMsIGZ1bmN0aW9uIChrKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXkgPSBrIHx8ICcnO1xyXG4gICAgICAgICAgICB2YWx1ZXMucHVzaCh0cmFuc2xhdGlvbnNba2V5XSB8fCBrZXkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zbGF0ZSBhbiBhcnJheSBvZiBzdHJpbmdzIGludG8gYXJyYXkgb2Ygb2JqZWN0cyAoc2V0KVxyXG4gICAgcHVibGljIHRyYW5zbGF0ZVNldChrZXlzOiBzdHJpbmdbXSwga2V5UHJvcDogc3RyaW5nLCB2YWx1ZVByb3A6IHN0cmluZyk6IGFueVtdIHtcclxuICAgICAgICBpZiAoXy5pc051bGwoa2V5cykgfHwga2V5cy5sZW5ndGggPT0gMCkgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgICBrZXlQcm9wID0ga2V5UHJvcCB8fCAnaWQnO1xyXG4gICAgICAgIHZhbHVlUHJvcCA9IHZhbHVlUHJvcCB8fCAnbmFtZSc7XHJcblxyXG4gICAgICAgIGxldCB2YWx1ZXM6IGFueVtdID0gW107XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9ucyA9IHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sYW5ndWFnZV0gfHwge307XHJcblxyXG4gICAgICAgIF8uZWFjaChrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTogYW55ID0ge307XHJcbiAgICAgICAgICAgIGtleSA9IGtleSB8fCAnJztcclxuXHJcbiAgICAgICAgICAgIHZhbHVlW2tleVByb3BdID0ga2V5O1xyXG4gICAgICAgICAgICB2YWx1ZVt2YWx1ZVByb3BdID0gdHJhbnNsYXRpb25zW2tleV0gfHwga2V5O1xyXG5cclxuICAgICAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRyYW5zbGF0ZSBhIGNvbGxlY3Rpb24gb2Ygb2JqZWN0c1xyXG4gICAgcHVibGljIHRyYW5zbGF0ZU9iamVjdHMoaXRlbXM6IGFueVtdLCBrZXlQcm9wOiBzdHJpbmcsIHZhbHVlUHJvcDogc3RyaW5nKTogYW55W10ge1xyXG4gICAgICAgIGlmIChfLmlzTnVsbChpdGVtcykgfHwgaXRlbXMubGVuZ3RoID09IDApIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAga2V5UHJvcCA9IGtleVByb3AgfHwgJ25hbWUnO1xyXG4gICAgICAgIHZhbHVlUHJvcCA9IHZhbHVlUHJvcCB8fCAnbmFtZUxvY2FsJztcclxuXHJcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9ucyA9IHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sYW5ndWFnZV0gfHwge307XHJcblxyXG4gICAgICAgIF8uZWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IGl0ZW1ba2V5UHJvcF0gfHwgJyc7XHJcblxyXG4gICAgICAgICAgICBpdGVtW3ZhbHVlUHJvcF0gPSB0cmFuc2xhdGlvbnNba2V5XSB8fCBrZXk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBpdGVtcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2xhdGUgYSBzdHJpbmcgYnkga2V5ICB3aXRoIHByZWZpeCB1c2luZyBzZXQgbGFuZ3VhZ2UgdG9kb1xyXG4gICAgcHVibGljIHRyYW5zbGF0ZVdpdGhQcmVmaXgocHJlZml4OiBzdHJpbmcsIGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgcHJlZml4ID0gcHJlZml4ID8gcHJlZml4ICsgJ18nIDogJyc7XHJcbiAgICAgICAga2V5ID0gKHByZWZpeCArIGtleSkucmVwbGFjZSgvIC9nLCAnXycpLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgaWYgKGtleSA9PSBudWxsKSByZXR1cm4gJyc7XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9ucyA9IHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sYW5ndWFnZV0gfHwge307XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uc1trZXldIHx8IGtleTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHRyYW5zbGF0ZVNldFdpdGhQcmVmaXgocHJlZml4OiBzdHJpbmcsIGtleXM6IHN0cmluZ1tdLCBrZXlQcm9wOiBzdHJpbmcsIHZhbHVlUHJvcDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKF8uaXNOdWxsKGtleXMpIHx8IGtleXMubGVuZ3RoID09IDApIHJldHVybiBbXTtcclxuXHJcbiAgICAgICAgcHJlZml4ID0gcHJlZml4ID8gcHJlZml4LnJlcGxhY2UoLyAvZywgJ18nKS50b1VwcGVyQ2FzZSgpIDogJyc7XHJcbiAgICAgICAga2V5UHJvcCA9IGtleVByb3AgfHwgJ2lkJztcclxuICAgICAgICB2YWx1ZVByb3AgPSB2YWx1ZVByb3AgfHwgJ25hbWUnO1xyXG5cclxuICAgICAgICBsZXQgdmFsdWVzID0gW107XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0aW9ucyA9IHRoaXMuX3RyYW5zbGF0aW9uc1t0aGlzLl9sYW5ndWFnZV0gfHwge307XHJcblxyXG4gICAgICAgIF8uZWFjaChrZXlzLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZTogYW55ID0ge307IFxyXG4gICAgICAgICAgICBrZXkgPSBrZXkgfHwgJyc7XHJcblxyXG4gICAgICAgICAgICB2YWx1ZVtrZXlQcm9wXSA9IGtleTtcclxuICAgICAgICAgICAgdmFsdWVbdmFsdWVQcm9wXSA9IHRyYW5zbGF0aW9uc1twcmVmaXggKyAnXycgKyBrZXldIHx8IGtleTtcclxuXHJcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBUcmFuc2xhdGUgYW4gYXJyYXkgb2Ygc3RyaW5ncywgYXBwbHkgdXBwZXJjYXNlIGFuZCByZXBsYWNlICcgJyA9PiAnXydcclxuICAgIHB1YmxpYyB0cmFuc2xhdGVTZXRXaXRoUHJlZml4MihwcmVmaXg6IHN0cmluZywga2V5czogc3RyaW5nW10sIGtleVByb3A6IHN0cmluZywgdmFsdWVQcm9wOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoXy5pc051bGwoa2V5cykgfHwga2V5cy5sZW5ndGggPT0gMCkgcmV0dXJuIFtdO1xyXG5cclxuICAgICAgICBrZXlQcm9wID0ga2V5UHJvcCB8fCAnaWQnO1xyXG4gICAgICAgIHZhbHVlUHJvcCA9IHZhbHVlUHJvcCB8fCAnbmFtZSc7XHJcbiAgICAgICAgcHJlZml4ID0gcHJlZml4ID8gcHJlZml4LnJlcGxhY2UoLyAvZywgJ18nKS50b1VwcGVyQ2FzZSgpICsgJ18nOiAnJztcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlcyA9IFtdO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGlvbnMgPSB0aGlzLl90cmFuc2xhdGlvbnNbdGhpcy5fbGFuZ3VhZ2VdIHx8IHt9O1xyXG5cclxuICAgICAgICBfLmVhY2goa2V5cywgZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICBsZXQgdmFsdWU6IGFueSA9IHt9O1xyXG4gICAgICAgICAgICBrZXkgPSBrZXkgfHwgJyc7XHJcblxyXG4gICAgICAgICAgICB2YWx1ZVtrZXlQcm9wXSA9IGtleTtcclxuICAgICAgICAgICAgdmFsdWVbdmFsdWVQcm9wXSA9IHRyYW5zbGF0aW9uc1twcmVmaXggKyBrZXkucmVwbGFjZSgvIC9nLCAnXycpLnRvVXBwZXJDYXNlKCldXHJcbiAgICAgICAgICAgICAgICB8fCAocHJlZml4ICsga2V5LnJlcGxhY2UoLyAvZywgJ18nKS50b1VwcGVyQ2FzZSgpKTtcclxuXHJcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcclxuICAgIH1cclxufVxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwVHJhbnNsYXRlJywgW10pO1xyXG5cclxuaW1wb3J0ICcuL1RyYW5zbGF0aW9uJztcclxuaW1wb3J0ICcuL1RyYW5zbGF0ZVNlcnZpY2UnO1xyXG5pbXBvcnQgJy4vVHJhbnNsYXRlRmlsdGVyJztcclxuaW1wb3J0ICcuL1RyYW5zbGF0ZURpcmVjdGl2ZSc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL1RyYW5zbGF0aW9uJztcclxuZXhwb3J0ICogZnJvbSAnLi9UcmFuc2xhdGVTZXJ2aWNlJztcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGxldCBSZXNldFBhZ2VFdmVudDogc3RyaW5nID0gXCJwaXBSZXNldFBhZ2VcIjtcclxuZXhwb3J0IGxldCBSZXNldEFyZWFFdmVudDogc3RyaW5nID0gXCJwaXBSZXNldEFyZWFcIjtcclxuXHJcbmV4cG9ydCBsZXQgUmVzZXRSb290VmFyOiBzdHJpbmcgPSBcIiRyZXNldFwiO1xyXG5leHBvcnQgbGV0IFJlc2V0QXJlYVJvb3RWYXI6IHN0cmluZyA9IFwiJHJlc2V0QXJlYVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJUGFnZVJlc2V0U2VydmljZSB7XHJcbiAgICByZXNldCgpOiB2b2lkO1xyXG4gICAgcmVzZXRBcmVhKGFyZWE6IHN0cmluZyk6IHZvaWQ7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBQYWdlUmVzZXRTZXJ2aWNlIGltcGxlbWVudHMgSVBhZ2VSZXNldFNlcnZpY2Uge1xyXG4gICAgcHJpdmF0ZSBfcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZTtcclxuICAgIHByaXZhdGUgX2xvZzogbmcuSUxvZ1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF90aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2U7XHJcblxyXG4gICAgcHVibGljIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLFxyXG4gICAgICAgICRsb2c6IG5nLklMb2dTZXJ2aWNlLCBcclxuICAgICAgICAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuX2xvZyA9ICRsb2c7XHJcbiAgICAgICAgdGhpcy5fdGltZW91dCA9ICR0aW1lb3V0O1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlW1Jlc2V0Um9vdFZhcl0gPSBmYWxzZTtcclxuICAgICAgICAkcm9vdFNjb3BlW1Jlc2V0QXJlYVJvb3RWYXJdID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fbG9nLmRlYnVnKFwiUmVzZXR0aW5nIHRoZSBlbnRpcmUgcGFnZVwiKTtcclxuICAgICAgICB0aGlzLnBlcmZvcm1SZXNldChudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzZXRBcmVhKGFyZWE6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2xvZy5kZWJ1ZyhcIlJlc2V0dGluZyB0aGUgYXJlYSBcIiArIGFyZWEpO1xyXG4gICAgICAgIHRoaXMucGVyZm9ybVJlc2V0KGFyZWEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGVyZm9ybVJlc2V0KGFyZWE/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGVbUmVzZXRSb290VmFyXSA9IGFyZWEgPT0gbnVsbDtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGVbUmVzZXRBcmVhUm9vdFZhcl0gPSBhcmVhO1xyXG5cclxuICAgICAgICB0aGlzLl90aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdFNjb3BlW1Jlc2V0Um9vdFZhcl0gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdFNjb3BlW1Jlc2V0QXJlYVJvb3RWYXJdID0gbnVsbDtcclxuICAgICAgICB9LCAwKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGhvb2tSZXNldEV2ZW50cyhcclxuICAgICRyb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlLCBcclxuICAgIHBpcFBhZ2VSZXNldDogSVBhZ2VSZXNldFNlcnZpY2VcclxuKSB7XHJcbiAgICAkcm9vdFNjb3BlLiRvbihSZXNldFBhZ2VFdmVudCwgKCkgPT4geyBwaXBQYWdlUmVzZXQucmVzZXQoKTsgfSk7XHJcbiAgICAkcm9vdFNjb3BlLiRvbihSZXNldEFyZWFFdmVudCwgKGV2ZW50LCBhcmVhKSA9PiB7IHBpcFBhZ2VSZXNldC5yZXNldEFyZWEoYXJlYSk7IH0pO1xyXG59XHJcblxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcFBhZ2VSZXNldCcsIFtdKVxyXG4gICAgLnNlcnZpY2UoJ3BpcFBhZ2VSZXNldCcsIFBhZ2VSZXNldFNlcnZpY2UpXHJcbiAgICAucnVuKGhvb2tSZXNldEV2ZW50cyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNjcm9sbFNlcnZpY2Uge1xyXG4gICAgc2Nyb2xsVG8ocGFyZW50RWxlbWVudCwgY2hpbGRFbGVtZW50LCBhbmltYXRpb25EdXJhdGlvbik6IHZvaWQ7XHJcbn1cclxuXHJcbmNsYXNzIFNjcm9sbFNlcnZpY2UgaW1wbGVtZW50cyBJU2Nyb2xsU2VydmljZSB7XHJcblxyXG4gICAgcHVibGljIHNjcm9sbFRvKHBhcmVudEVsZW1lbnQsIGNoaWxkRWxlbWVudCwgYW5pbWF0aW9uRHVyYXRpb24pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXBhcmVudEVsZW1lbnQgfHwgIWNoaWxkRWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvbiA9PSB1bmRlZmluZWQpIGFuaW1hdGlvbkR1cmF0aW9uID0gMzAwO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCEkKGNoaWxkRWxlbWVudCkucG9zaXRpb24oKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgbW9kRGlmZj0gTWF0aC5hYnMoJChwYXJlbnRFbGVtZW50KS5zY3JvbGxUb3AoKSAtICQoY2hpbGRFbGVtZW50KS5wb3NpdGlvbigpLnRvcCk7XHJcbiAgICAgICAgICAgIGlmIChtb2REaWZmIDwgMjApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvID0gJChwYXJlbnRFbGVtZW50KS5zY3JvbGxUb3AoKSArICgkKGNoaWxkRWxlbWVudCkucG9zaXRpb24oKS50b3AgLSAyMCk7XHJcbiAgICAgICAgICAgIGlmIChhbmltYXRpb25EdXJhdGlvbiA+IDApXHJcbiAgICAgICAgICAgICAgICAkKHBhcmVudEVsZW1lbnQpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsVG8gKyAncHgnXHJcbiAgICAgICAgICAgICAgICB9LCBhbmltYXRpb25EdXJhdGlvbik7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBTY3JvbGwnLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdwaXBTY3JvbGwnLCBTY3JvbGxTZXJ2aWNlKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU3lzdGVtSW5mbyB7XHJcbiAgICBicm93c2VyTmFtZTogc3RyaW5nO1xyXG4gICAgYnJvd3NlclZlcnNpb246IHN0cmluZztcclxuICAgIHBsYXRmb3JtOiBzdHJpbmc7XHJcbiAgICBvczogc3RyaW5nO1xyXG5cclxuICAgIGlzRGVza3RvcCgpOiBib29sZWFuO1xyXG4gICAgaXNNb2JpbGUoKTogYm9vbGVhbjtcclxuICAgIGlzQ29yZG92YSgpOiBib29sZWFuO1xyXG4gICAgaXNTdXBwb3J0ZWQoc3VwcG9ydGVkPzogYW55KTogYm9vbGVhbjtcclxufVxyXG5cclxuXHJcbmNsYXNzIFN5c3RlbUluZm8gaW1wbGVtZW50cyBJU3lzdGVtSW5mbyB7XHJcbiAgICBwcml2YXRlIF93aW5kb3c6IG5nLklXaW5kb3dTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcigkd2luZG93OiBuZy5JV2luZG93U2VydmljZSkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgdGhpcy5fd2luZG93ID0gJHdpbmRvdztcclxuICAgIH1cclxuXHJcbiAgICAvLyB0b2RvIGFkZCBzdXBwb3J0IGZvciBpUGhvbmVcclxuICAgIHB1YmxpYyBnZXQgYnJvd3Nlck5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdWEgPSB0aGlzLl93aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuXHJcbiAgICAgICAgaWYgKHVhLnNlYXJjaCgvRWRnZS8pID4gLTEpIHJldHVybiBcImVkZ2VcIjtcclxuICAgICAgICBpZiAodWEuc2VhcmNoKC9NU0lFLykgPiAtMSkgcmV0dXJuIFwiaWVcIjtcclxuICAgICAgICBpZiAodWEuc2VhcmNoKC9UcmlkZW50LykgPiAtMSkgcmV0dXJuIFwiaWVcIjtcclxuICAgICAgICBpZiAodWEuc2VhcmNoKC9GaXJlZm94LykgPiAtMSkgcmV0dXJuIFwiZmlyZWZveFwiO1xyXG4gICAgICAgIGlmICh1YS5zZWFyY2goL09wZXJhLykgPiAtMSkgcmV0dXJuIFwib3BlcmFcIjtcclxuICAgICAgICBpZiAodWEuc2VhcmNoKC9PUFIvKSA+IC0xKSByZXR1cm4gXCJvcGVyYVwiO1xyXG4gICAgICAgIGlmICh1YS5zZWFyY2goL1lhQnJvd3Nlci8pID4gLTEpIHJldHVybiBcInlhYnJvd3NlclwiO1xyXG4gICAgICAgIGlmICh1YS5zZWFyY2goL0Nocm9tZS8pID4gLTEpIHJldHVybiBcImNocm9tZVwiO1xyXG4gICAgICAgIGlmICh1YS5zZWFyY2goL1NhZmFyaS8pID4gLTEpIHJldHVybiBcInNhZmFyaVwiO1xyXG4gICAgICAgIGlmICh1YS5zZWFyY2goL01heHRob24vKSA+IC0xKSByZXR1cm4gXCJtYXh0aG9uXCI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIFwidW5rbm93blwiO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgYnJvd3NlclZlcnNpb24oKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdmVyc2lvbjtcclxuICAgICAgICBsZXQgdWEgPSB0aGlzLl93aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuICAgICAgICBsZXQgYnJvd3NlciA9IHRoaXMuYnJvd3Nlck5hbWU7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoYnJvd3Nlcikge1xyXG4gICAgICAgICAgICBjYXNlIFwiZWRnZVwiOlxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbiA9ICh1YS5zcGxpdChcIkVkZ2VcIilbMV0pLnNwbGl0KFwiL1wiKVsxXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiaWVcIjpcclxuICAgICAgICAgICAgICAgIHZlcnNpb24gPSAodWEuc3BsaXQoXCJNU0lFIFwiKVsxXSkuc3BsaXQoXCI7XCIpWzBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJpZTExXCI6XHJcbiAgICAgICAgICAgICAgICBicm93c2VyID0gXCJpZVwiO1xyXG4gICAgICAgICAgICAgICAgdmVyc2lvbiA9ICh1YS5zcGxpdChcIjsgcnY6XCIpWzFdKS5zcGxpdChcIilcIilbMF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImZpcmVmb3hcIjpcclxuICAgICAgICAgICAgICAgIHZlcnNpb24gPSB1YS5zcGxpdChcIkZpcmVmb3gvXCIpWzFdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJvcGVyYVwiOlxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbiA9IHVhLnNwbGl0KFwiVmVyc2lvbi9cIilbMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIm9wZXJhV2Via2l0XCI6XHJcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gdWEuc3BsaXQoXCJPUFIvXCIpWzFdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ5YWJyb3dzZXJcIjpcclxuICAgICAgICAgICAgICAgIHZlcnNpb24gPSAodWEuc3BsaXQoXCJZYUJyb3dzZXIvXCIpWzFdKS5zcGxpdChcIiBcIilbMF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcImNocm9tZVwiOlxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbiA9ICh1YS5zcGxpdChcIkNocm9tZS9cIilbMV0pLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwic2FmYXJpXCI6XHJcbiAgICAgICAgICAgICAgICB2ZXJzaW9uID0gKHVhLnNwbGl0KFwiVmVyc2lvbi9cIilbMV0pLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwibWF4dGhvblwiOlxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbiA9IHVhLnNwbGl0KFwiTWF4dGhvbi9cIilbMV07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2ZXJzaW9uO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IHBsYXRmb3JtKCk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHVhID0gdGhpcy5fd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XHJcblxyXG4gICAgICAgIGlmICgvaXBob25lfGlwYWR8aXBvZHxhbmRyb2lkfGJsYWNrYmVycnl8bWluaXx3aW5kb3dzXFxzY2V8cGFsbS9pLnRlc3QodWEudG9Mb3dlckNhc2UoKSkpIFxyXG4gICAgICAgICAgICByZXR1cm4gJ21vYmlsZSc7XHJcblxyXG4gICAgICAgIHJldHVybiAnZGVza3RvcCc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBvcygpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCB1YSA9IHRoaXMuX3dpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgb3NBbGwgPSAoLyh3aW5kb3dzfG1hY3xhbmRyb2lkfGxpbnV4fGJsYWNrYmVycnl8c3Vub3N8c29sYXJpc3xpcGhvbmUpLy5leGVjKHVhLnRvTG93ZXJDYXNlKCkpIHx8IFt1YV0pWzBdLnJlcGxhY2UoJ3N1bm9zJywgJ3NvbGFyaXMnKTtcclxuICAgICAgICAgICAgbGV0IG9zQW5kcm9pZCA9ICgvKGFuZHJvaWQpLy5leGVjKHVhLnRvTG93ZXJDYXNlKCkpIHx8ICcnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9zQW5kcm9pZCAmJiAob3NBbmRyb2lkID09ICdhbmRyb2lkJyB8fCAob3NBbmRyb2lkWzBdID09ICdhbmRyb2lkJykpID8gJ2FuZHJvaWQnIDogb3NBbGw7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAndW5rbm93bidcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzRGVza3RvcCgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF0Zm9ybSA9PSAnZGVza3RvcCc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGlzTW9iaWxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXRmb3JtID09ICdtb2JpbGUnO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRvZG86IGNvbXBsZXRlIGltcGxlbWVudGF0aW9uXHJcbiAgICBwdWJsaWMgaXNDb3Jkb3ZhKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUb2RvOiBNb3ZlIHRvIGVycm9yc1xyXG4gICAgcHVibGljIGlzU3VwcG9ydGVkKHN1cHBvcnRlZD86IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICghc3VwcG9ydGVkKSBcclxuICAgICAgICAgICAgc3VwcG9ydGVkID0ge1xyXG4gICAgICAgICAgICAgICAgZWRnZTogMTEsXHJcbiAgICAgICAgICAgICAgICBpZTogMTEsXHJcbiAgICAgICAgICAgICAgICBmaXJlZm94OiA0MywgLy80LCBmb3IgdGVzdGluZ1xyXG4gICAgICAgICAgICAgICAgb3BlcmE6IDM1LFxyXG4gICAgICAgICAgICAgICAgY2hyb21lOiA0N1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgYnJvd3NlciA9IHRoaXMuYnJvd3Nlck5hbWU7XHJcbiAgICAgICAgbGV0IHZlcnNpb24gPSB0aGlzLmJyb3dzZXJWZXJzaW9uO1xyXG4gICAgICAgIHZlcnNpb24gPSB2ZXJzaW9uLnNwbGl0KFwiLlwiKVswXVxyXG5cclxuICAgICAgICBpZiAoYnJvd3NlciAmJiBzdXBwb3J0ZWRbYnJvd3Nlcl0gJiYgdmVyc2lvbiA+PSBzdXBwb3J0ZWRbYnJvd3Nlcl0pIFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBTeXN0ZW1JbmZvJywgW10pXHJcbiAgICAuc2VydmljZSgncGlwU3lzdGVtSW5mbycsIFN5c3RlbUluZm8pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUaW1lclNlcnZpY2Uge1xyXG4gICAgaXNTdGFydGVkKCk6IGJvb2xlYW47XHJcblxyXG4gICAgYWRkRXZlbnQoZXZlbnQ6IHN0cmluZywgdGltZW91dDogbnVtYmVyKTogdm9pZDtcclxuICAgIHJlbW92ZUV2ZW50KGV2ZW50OiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgY2xlYXJFdmVudHMoKTogdm9pZDtcclxuXHJcbiAgICBzdGFydCgpOiB2b2lkO1xyXG4gICAgc3RvcCgpOiB2b2lkO1xyXG59XHJcblxyXG5cclxuY2xhc3MgVGltZXJFdmVudCB7XHJcbiAgICBwdWJsaWMgZXZlbnQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB0aW1lb3V0OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgaW50ZXJ2YWw6IGFueTtcclxuXHJcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoZXZlbnQ6IHN0cmluZywgdGltZW91dDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5ldmVudCA9IGV2ZW50O1xyXG4gICAgICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5sZXQgRGVmYXVsdEV2ZW50czogVGltZXJFdmVudFtdID0gW1xyXG4gICAgbmV3IFRpbWVyRXZlbnQoJ3BpcEF1dG9QdWxsQ2hhbmdlcycsIDYwMDAwKSwgLy8gMSBtaW5cclxuICAgIG5ldyBUaW1lckV2ZW50KCdwaXBBdXRvVXBkYXRlUGFnZScsIDE1MDAwKSwgLy8gMTUgc2VjXHJcbiAgICBuZXcgVGltZXJFdmVudCgncGlwQXV0b1VwZGF0ZUNvbGxlY3Rpb24nLCAzMDAwMDApIC8vIDUgbWluXHJcbl07XHJcblxyXG5cclxuY2xhc3MgVGltZXJTZXJ2aWNlIGltcGxlbWVudHMgSVRpbWVyU2VydmljZSB7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG4gICAgcHJpdmF0ZSBfbG9nOiBuZy5JTG9nU2VydmljZTtcclxuICAgIHByaXZhdGUgX2ludGVydmFsOiBuZy5JSW50ZXJ2YWxTZXJ2aWNlOyAgICAgICAgXHJcbiAgICBwcml2YXRlIF9zdGFydGVkID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9ldmVudHM6IFRpbWVyRXZlbnRbXSA9IF8uY2xvbmVEZWVwKERlZmF1bHRFdmVudHMpO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSxcclxuICAgICAgICAkbG9nOiBuZy5JTG9nU2VydmljZSwgXHJcbiAgICAgICAgJGludGVydmFsOiBuZy5JSW50ZXJ2YWxTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgIHRoaXMuX3Jvb3RTY29wZSA9ICRyb290U2NvcGU7XHJcbiAgICAgICAgdGhpcy5fbG9nID0gJGxvZztcclxuICAgICAgICB0aGlzLl9pbnRlcnZhbCA9ICRpbnRlcnZhbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaXNTdGFydGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdGFydGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRFdmVudChldmVudDogc3RyaW5nLCB0aW1lb3V0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB2YXIgZXhpc3RpbmdFdmVudCA9IF8uZmluZCh0aGlzLl9ldmVudHMsIChlKSA9PiBlLmV2ZW50ID09IGV2ZW50KTtcclxuICAgICAgICBpZiAoZXhpc3RpbmdFdmVudCAhPSBudWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgIGxldCBuZXdFdmVudCA9IDxUaW1lckV2ZW50PiB7XHJcbiAgICAgICAgICAgIGV2ZW50OiBldmVudCxcclxuICAgICAgICAgICAgdGltZW91dDogdGltZW91dFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzLnB1c2gobmV3RXZlbnQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc3RhcnRlZClcclxuICAgICAgICAgICAgdGhpcy5zdGFydEV2ZW50KG5ld0V2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlRXZlbnQoZXZlbnQ6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9ldmVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgbGV0IGV4aXN0aW5nRXZlbnQgPSB0aGlzLl9ldmVudHNbaV07XHJcbiAgICAgICAgICAgIGlmIChleGlzdGluZ0V2ZW50LmV2ZW50ID09IGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BFdmVudChleGlzdGluZ0V2ZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhcnRFdmVudChldmVudDogVGltZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGV2ZW50LmludGVydmFsID0gdGhpcy5faW50ZXJ2YWwoXHJcbiAgICAgICAgICAgICgpID0+IHsgXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2cuZGVidWcoJ0dlbmVyYXRlZCB0aW1lciBldmVudCAnICsgZXZlbnQuZXZlbnQpOyBcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Jvb3RTY29wZS4kZW1pdChldmVudC5ldmVudClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXZlbnQudGltZW91dFxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0b3BFdmVudChldmVudDogVGltZXJFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGlmIChldmVudC5pbnRlcnZhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnRlcnZhbC5jYW5jZWwoZXZlbnQuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgLy8gRG8gbm90aGluZ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50LmludGVydmFsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXJ0KCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGFydGVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIF8uZWFjaCh0aGlzLl9ldmVudHMsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RvcCgpOiB2b2lkIHtcclxuICAgICAgICBfLmVhY2godGhpcy5fZXZlbnRzLCAoZXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwVGltZXInLCBbXSlcclxuICAgIC5zZXJ2aWNlKCdwaXBUaW1lcicsIFRpbWVyU2VydmljZSk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvZGVzIHtcclxuICAgIC8vIFNpbXBsZSB2ZXJzaW9uIG9mIHN0cmluZyBoYXNoY29kZVxyXG4gICAgaGFzaCh2YWx1ZTogc3RyaW5nKTogbnVtYmVyO1xyXG4gICAgLy8gR2VuZXJhdGVzIHJhbmRvbSBiaWcgbnVtYmVyIGZvciB2ZXJpZmljYXRpb24gY29kZXNcclxuICAgIHZlcmlmaWNhdGlvbigpOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBDb2RlcyBpbXBsZW1lbnRzIElDb2RlcyB7XHJcbiAgICAvLyBTaW1wbGUgdmVyc2lvbiBvZiBzdHJpbmcgaGFzaGNvZGVcclxuICAgIHB1YmxpYyBoYXNoKHZhbHVlOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gMDtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICByZXN1bHQgKz0gdmFsdWUuY2hhckNvZGVBdChpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBHZW5lcmF0ZXMgcmFuZG9tIGJpZyBudW1iZXIgZm9yIHZlcmlmaWNhdGlvbiBjb2Rlc1xyXG4gICAgcHVibGljIHZlcmlmaWNhdGlvbigpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgMTApLnRvVXBwZXJDYXNlKCk7IC8vIHJlbW92ZSBgMC5gXHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcENvZGVzJywgW10pXHJcbiAgICAuc2VydmljZSgncGlwQ29kZXMnLCBDb2Rlcyk7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUZvcm1hdCB7XHJcbiAgICAvLyBDcmVhdGVzIGEgc2FtcGxlIGxpbmUgZnJvbSBhIHRleHRcclxuICAgIHNhbXBsZSh2YWx1ZTogc3RyaW5nLCBtYXhMZW5ndGg6IG51bWJlcik6IHN0cmluZztcclxuXHJcbiAgICBzcHJpbnRmKG1lc3NhZ2U6IHN0cmluZywgLi4uYXJnczogYW55W10pOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG5jbGFzcyBGb3JtYXQgaW1wbGVtZW50cyBJRm9ybWF0IHtcclxuICAgIC8vIENhY2hlZCBmb3IgcGFyc2VkIGZvcm1hdHNcclxuICAgIHByaXZhdGUgY2FjaGUgPSB7fTtcclxuXHJcbiAgICAvLyBDcmVhdGVzIGEgc2FtcGxlIGxpbmUgZnJvbSBhIHRleHRcclxuICAgIHB1YmxpYyBzYW1wbGUodmFsdWU6IHN0cmluZywgbWF4TGVuZ3RoOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghdmFsdWUgfHwgdmFsdWUgPT0gJycpIHJldHVybiAnJztcclxuXHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlLmluZGV4T2YoJ1xcbicpO1xyXG4gICAgICAgIGxlbmd0aCA9IGxlbmd0aCA+PSAwID8gbGVuZ3RoIDogdmFsdWUubGVuZ3RoO1xyXG4gICAgICAgIGxlbmd0aCA9IGxlbmd0aCA8IG1heExlbmd0aCA/IHZhbHVlLmxlbmd0aCA6IG1heExlbmd0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RyUmVwZWF0KHN0cjogc3RyaW5nLCBxdHk6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHF0eSA8IDEpIHJldHVybiAnJztcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgd2hpbGUgKHF0eSA+IDApIHtcclxuICAgICAgICAgICAgaWYgKHF0eSAmIDEpIHJlc3VsdCArPSBzdHI7XHJcbiAgICAgICAgICAgIHF0eSA+Pj0gMSwgc3RyICs9IHN0cjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldFR5cGUodmFyaWFibGUpIHtcclxuICAgICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUZvcm1hdChmbXQ6IHN0cmluZykge1xyXG4gICAgICAgIGxldCBfZm10ID0gZm10LCBtYXRjaCA9IFtdLCBwYXJzZV90cmVlID0gW10sIGFyZ19uYW1lcyA9IDA7XHJcbiAgICAgICAgd2hpbGUgKF9mbXQpIHtcclxuICAgICAgICAgICAgaWYgKChtYXRjaCA9IC9eW15cXHgyNV0rLy5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoWzBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSAvXlxceDI1ezJ9Ly5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKCclJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoKG1hdGNoID0gL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXlxcKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZm9zdXhYXSkvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLCByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLCBmaWVsZF9tYXRjaCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSAvXihbYS16X11bYS16X1xcZF0qKS9pLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKHJlcGxhY2VtZW50X2ZpZWxkID0gcmVwbGFjZW1lbnRfZmllbGQuc3Vic3RyaW5nKGZpZWxkX21hdGNoWzBdLmxlbmd0aCkpICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2kuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbGlzdC5wdXNoKGZpZWxkX21hdGNoWzFdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFxbKFxcZCspXFxdLy5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlcnJvcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBtYXRjaFsyXSA9IGZpZWxkX2xpc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhcmdfbmFtZXMgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01peGluZyBwb3NpdGlvbmFsIGFuZCBuYW1lZCBwbGFjZWhvbGRlcnMgaXMgbm90ICh5ZXQpIHN1cHBvcnRlZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlcnJvcicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGFyc2VfdHJlZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZvcm1hdChwYXJzZV90cmVlLCBhcmd2KSB7XHJcbiAgICAgICAgbGV0IGN1cnNvciA9IDA7IFxyXG4gICAgICAgIGxldCB0cmVlX2xlbmd0aCA9IHBhcnNlX3RyZWUubGVuZ3RoOyBcclxuICAgICAgICBsZXQgb3V0cHV0ID0gW107XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZV9sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgbm9kZV90eXBlID0gdGhpcy5nZXRUeXBlKHBhcnNlX3RyZWVbaV0pO1xyXG4gICAgICAgICAgICBpZiAobm9kZV90eXBlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gocGFyc2VfdHJlZVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobm9kZV90eXBlID09PSAnYXJyYXknKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF0Y2ggPSBwYXJzZV90cmVlW2ldOyAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XHJcbiAgICAgICAgICAgICAgICBsZXQgYXJnOiBhbnk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHsgLy8ga2V5d29yZCBhcmd1bWVudFxyXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG1hdGNoWzJdLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXJnLmhhc093blByb3BlcnR5KG1hdGNoWzJdW2tdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMuc3ByaW50ZignUHJvcGVydHkgXCIlc1wiIGRvZXMgbm90IGV4aXN0JywgbWF0Y2hbMl1ba10pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmdbbWF0Y2hbMl1ba11dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2hbMV0pIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndlttYXRjaFsxXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK107XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKC9bXnNdLy50ZXN0KG1hdGNoWzhdKSAmJiAodGhpcy5nZXRUeXBlKGFyZykgIT0gJ251bWJlcicpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHRoaXMuc3ByaW50ZignRXhwZWN0aW5nIG51bWJlciBidXQgZm91bmQgJXMnLCB0aGlzLmdldFR5cGUoYXJnKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtYXRjaFs4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2InOiBhcmcgPSBhcmcudG9TdHJpbmcoMik7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2MnOiBhcmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGFyZyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2QnOiBhcmcgPSBwYXJzZUludChhcmcsIDEwKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZSc6IGFyZyA9IG1hdGNoWzddID8gYXJnLnRvRXhwb25lbnRpYWwobWF0Y2hbN10pIDogYXJnLnRvRXhwb25lbnRpYWwoKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnZic6IGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQobWF0Y2hbN10pIDogcGFyc2VGbG9hdChhcmcpOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdvJzogYXJnID0gYXJnLnRvU3RyaW5nKDgpOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdzJzogYXJnID0gKChhcmcgPSBTdHJpbmcoYXJnKSkgJiYgbWF0Y2hbN10gPyBhcmcuc3Vic3RyaW5nKDAsIG1hdGNoWzddKSA6IGFyZyk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3UnOiBhcmcgPSBNYXRoLmFicyhhcmcpOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd4JzogYXJnID0gYXJnLnRvU3RyaW5nKDE2KTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnWCc6IGFyZyA9IGFyZy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhcmcgPSAoL1tkZWZdLy50ZXN0KG1hdGNoWzhdKSAmJiBtYXRjaFszXSAmJiBhcmcgPj0gMCA/ICcrJysgYXJnIDogYXJnKTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgcGFkX2NoYXJhY3RlciA9IG1hdGNoWzRdID8gbWF0Y2hbNF0gPT0gJzAnID8gJzAnIDogbWF0Y2hbNF0uY2hhckF0KDEpIDogJyAnO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhZF9sZW5ndGggPSBtYXRjaFs2XSAtIFN0cmluZyhhcmcpLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGxldCBwYWQgPSBtYXRjaFs2XSA/IHRoaXMuc3RyUmVwZWF0KHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgpIDogJyc7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChtYXRjaFs1XSA/IGFyZyArIHBhZCA6IHBhZCArIGFyZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHNwcmludGYobWVzc2FnZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlLmhhc093blByb3BlcnR5KG1lc3NhZ2UpKVxyXG4gICAgICAgICAgICB0aGlzLmNhY2hlW21lc3NhZ2VdID0gdGhpcy5wYXJzZUZvcm1hdChtZXNzYWdlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHRoaXMuY2FjaGVbbWVzc2FnZV0sIGFyZ3MpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwRm9ybWF0JywgW10pXHJcbiAgICAuc2VydmljZSgncGlwRm9ybWF0JywgRm9ybWF0KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICcuL0Zvcm1hdCc7XHJcbmltcG9ydCAnLi9UaW1lclNlcnZpY2UnO1xyXG5pbXBvcnQgJy4vU2Nyb2xsU2VydmljZSc7XHJcbmltcG9ydCAnLi9UYWdzJztcclxuaW1wb3J0ICcuL0NvZGVzJztcclxuaW1wb3J0ICcuL1N5c3RlbUluZm8nO1xyXG5pbXBvcnQgJy4vUGFnZVJlc2V0U2VydmljZSc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL0Zvcm1hdCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vVGltZXJTZXJ2aWNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9TY3JvbGxTZXJ2aWNlJztcclxuZXhwb3J0ICogZnJvbSAnLi9UYWdzJztcclxuZXhwb3J0ICogZnJvbSAnLi9Db2Rlcyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vU3lzdGVtSW5mbyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vUGFnZVJlc2V0U2VydmljZSc7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVGFncyB7XHJcbiAgICBub3JtYWxpemVPbmUodGFnOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICBjb21wcmVzc09uZSh0YWc6IHN0cmluZyk6IHN0cmluZztcclxuICAgIGVxdWFsKHRhZzE6IHN0cmluZywgdGFnMjogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIG5vcm1hbGl6ZUFsbCh0YWdzOiBhbnkpOiBzdHJpbmdbXTtcclxuICAgIGNvbXByZXNzQWxsKHRhZ3M6IGFueSk6IHN0cmluZ1tdO1xyXG4gICAgZXh0cmFjdChlbnRpdHk6IGFueSwgc2VhcmNoRmllbGRzPzogc3RyaW5nW10pOiBzdHJpbmdbXTtcclxufVxyXG5cclxuXHJcbmNsYXNzIFRhZ3MgaW1wbGVtZW50cyBJVGFncyB7XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZU9uZSh0YWc6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRhZyBcclxuICAgICAgICAgICAgPyBfLnRyaW0odGFnLnJlcGxhY2UoLyhffCMpKy9nLCAnICcpKVxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbXByZXNzT25lKHRhZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGFnXHJcbiAgICAgICAgICAgID8gdGFnLnJlcGxhY2UoLyggfF98IykvZywgJycpLnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlcXVhbCh0YWcxOiBzdHJpbmcsIHRhZzI6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0YWcxID09IG51bGwgJiYgdGFnMiA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICBpZiAodGFnMSA9PSBudWxsIHx8IHRhZzIgPT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXByZXNzT25lKHRhZzEpID09IHRoaXMuY29tcHJlc3NPbmUodGFnMik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vcm1hbGl6ZUFsbCh0YWdzOiBhbnkpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcodGFncykpXHJcbiAgICAgICAgICAgIHRhZ3MgPSB0YWdzLnNwbGl0KC8oIHwsfDspKy8pO1xyXG5cclxuICAgICAgICB0YWdzID0gXy5tYXAodGFncywgKHRhZzogc3RyaW5nKSA9PiB0aGlzLm5vcm1hbGl6ZU9uZSh0YWcpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRhZ3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvbXByZXNzQWxsKHRhZ3M6IGFueSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBpZiAoXy5pc1N0cmluZyh0YWdzKSlcclxuICAgICAgICAgICAgdGFncyA9IHRhZ3Muc3BsaXQoLyggfCx8OykrLyk7XHJcblxyXG4gICAgICAgIHRhZ3MgPSBfLm1hcCh0YWdzLCAodGFnOiBzdHJpbmcpID0+IHRoaXMuY29tcHJlc3NPbmUodGFnKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0YWdzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBleHRyYWN0KGVudGl0eTogYW55LCBzZWFyY2hGaWVsZHM/OiBzdHJpbmdbXSk6IHN0cmluZ1tdIHtcclxuICAgICAgICBsZXQgdGFncyA9IHRoaXMubm9ybWFsaXplQWxsKGVudGl0eS50YWdzKTtcclxuXHJcbiAgICAgICAgXy5lYWNoKHNlYXJjaEZpZWxkcywgKGZpZWxkKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gZW50aXR5W2ZpZWxkXSB8fCAnJztcclxuXHJcbiAgICAgICAgICAgIGlmICh0ZXh0ICE9ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGFzaFRhZ3MgPSB0ZXh0Lm1hdGNoKC8jXFx3Ky9nKTtcclxuICAgICAgICAgICAgICAgIHRhZ3MgPSB0YWdzLmNvbmNhdCh0aGlzLm5vcm1hbGl6ZUFsbChoYXNoVGFncykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBfLnVuaXEodGFncyk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBUYWdzJywgW10pXHJcbiAgICAuc2VydmljZSgncGlwVGFncycsIFRhZ3MpO1xyXG4iXX0=