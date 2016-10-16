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

	thisModule.config(function(pipTranslateProvider) {
        
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
		
	});

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
        function ($rootScope, pipError) {

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
        }
    );

})();
