/**
 * @file Assertion utilities
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipAssert', ['pipDebug']);

    thisModule.provider('pipAssert', function (pipDebugProvider) {

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
            
            $get: function(pipDebug) {
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
            }
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

    });

})();
