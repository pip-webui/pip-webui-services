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
        function ($rootScope, pipAssert) {

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
        }
    );
    
})();