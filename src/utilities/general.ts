/// <reference path="../../typings/tsd.d.ts" />

// (function () {
//     'use strict';

//     var thisModule = angular.module('pipUtils.General', ['pipState', 'pipAssert']);

//     thisModule.factory('pipUtils', function ($rootScope, $window, $state, pipAssert) {

//         function strRepeat(str, qty) {
//             if (qty < 1) return '';
//             var result = '';
//             while (qty > 0) {
//                 if (qty & 1) result += str;
//                 qty >>= 1, str += str;
//             }
//             return result;
//         }

//         var toString = Object.prototype.toString;

//         return {
//             copyProperty: copyProperty,
//             copy: copyProperty,
//             swapProperties: swapProperties,
//             swap: swapProperties,
//             convertToBoolean: convertToBoolean,
//             toBoolean: convertToBoolean,
//             toBool: convertToBoolean,
//             convertObjectIdsToString: convertObjectIdsToString,
//             OidToString: convertObjectIdsToString,
//             // generateVerificationCode: generateVerificationCode,
//             // vercode: generateVerificationCode,
//             equalObjectIds: equalObjectIds,
//             eqOid: equalObjectIds,
//             notEqualObjectIds: notEqualObjectIds,
//             neqOid: notEqualObjectIds,
//             containsObjectId: containsObjectId,
//             hasOid: containsObjectId,
//             isObjectId: isObjectId,
//             // Strings functions. No analogues in lodash.strings
//             // hashCode: hashCode,
//             makeString: makeString,
//             // Collection function. No analogues in lodash. It may be in lodash later. Look gitHub/lodash issue #1022
//             replaceBy: replaceBy
//         };
        
//         //--------------------
//         function replaceBy(items, key, value, data) {
//             if (!items || !items.length)
//                 return null;
//             for (var i = 0; i < items.length; i++) {
//                 if (items[i][key] == value) {
//                     items[i] = data;
//                     return;
//                 }
//             }
//         };

//         // Ensure some object is a coerced to a string
//         function makeString(object) {
//             if (object == null) return '';
//             return '' + object;
//         };

//         function isObjectId(value) {
//             var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
//             return checkForHexRegExp.test(value);
//         }

//         // Compares two ObjectIds (they are not equal by '==')
//         function equalObjectIds(value1, value2) {
//             if (value1 == null && value2 == null)
//                 return true;

//             if (value1 == null || value2 == null)
//                 return false;

//             return value1.toString() == value2.toString();
//         };

//         // Compares two ObjectIds (they are always not equal by '!=')
//         function notEqualObjectIds(value1, value2) {
//             if (value1 == null && value2 == null)
//                 return false;

//             if (value1 == null || value2 == null)
//                 return true;

//             return value1.toString() != value2.toString();
//         };

//         // Checks if array contains concrete objectId
//         function containsObjectId(values, value) {
//             return _.some(values, function (value1) {
//                 return equalObjectIds(value1, value);
//             });
//         };

//         // Copy property from one object to another if it exists (not null)
//         function copyProperty(dest, destProperty, orig, origProperty) {
//             // Shift if only 3 arguments set
//             if (_.isObject(destProperty)
//                 && typeof (origProperty) == 'undefined') {
//                 origProperty = orig;
//                 orig = destProperty;
//                 destProperty = origProperty;
//             }
    
//             if (orig[origProperty] || (typeof (orig[origProperty]) === 'number' && orig[origProperty] % 1 == 0)) {
//                 dest[destProperty] = orig[origProperty];
//                 return true;
//             }
    
//             return false;
//         };
    
//         // Swaps values of two properties
//         function swapProperties(obj, prop1, prop2) {
//             var 
//                 temp1 = obj[prop1],
//                 temp2 = obj[prop2];
    
//             if (temp1) {
//                 obj[prop2] = temp1;
//             }
//             else {
//                 delete obj[prop2];
//             }
    
//             if (temp2) {
//                 obj[prop1] = temp2;
//             }
//             else {
//                 delete obj[prop1];
//             }
//         };
    
//         // Converts value into boolean
//         function convertToBoolean(value) {
//             if (value == null) return false;
//             if (!value) return false;
//             value = value.toString().toLowerCase();
//             return value == '1' || value == 'true';
//         };
    
//         // Converts array of object ids to strings (for comparison)
//         function convertObjectIdsToString(values) {
//             return _.map(values, function (value) {
//                 return value ? value.toString() : 0;
//             });
//         };


//     });

// })();
