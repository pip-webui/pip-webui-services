// /**
//  * @file Collection utilities
//  * @copyright Digital Living Software Corp. 2014-2016
//  */

// /* global _, angular */

// // Todo: Deprecate
// (function () {
//     'use strict';

//     var thisModule = angular.module('pipUtils.Collections', []);

//     thisModule.factory('pipCollections', function () {
//         var collections = {};

//         // Index of element in array by key
//         collections.indexBy = function (items, key, value) {
//             if (!items || !items.length)
//                 return null;
//             for (var i = 0; i < items.length; i++) {
//                 if (items[i][key] == value) {
//                     return i;
//                 }
//             }
//             return null;
//         };
    
//         // Find element in array by key
//         collections.findBy = function (items, key, value) {
//             if (!items || !items.length)
//                 return null;
//             for (var i = 0; i < items.length; i++) {
//                 if (items[i][key] == value) {
//                     return items[i];
//                 }
//             }
//             return null;
//         };
    
//         // Remove element from array by value
//         collections.remove = function (items, item) {
//             if (!items || !items.length)
//                 return null;
//             for (var i = 0; i < items.length; i++) {
//                 if (items[i] == item) {
//                     items.splice(i, 1);
//                     i--;
//                 }
//             }
//         };
    
//         // Removes element from array by key
//         collections.removeBy = function (items, key, value) {
//             if (!items || !items.length)
//                 return null;
//             for (var i = 0; i < items.length; i++) {
//                 if (items[i][key] == value) {
//                     items.splice(i, 1);
//                     i--;
//                 }
//             }
//         };
    
//         // Replaced element by key
//         collections.replaceBy = function (items, key, value, data) {
//             if (!items || !items.length)
//                 return null;
//             for (var i = 0; i < items.length; i++) {
//                 if (items[i][key] == value) {
//                     items[i] = data;
//                     return;
//                 }
//             }
//         };
    
//         // Calculate difference between two collections
//         collections.difference = function (a1, a2, comparator) {
//             var result = [];
    
//             _.each(a1, function (e1) {
//                 var e2 = _.find(a2, function (e) {
//                     return comparator(e1, e);
//                 });
    
//                 if (e2 == null) {
//                     result.push(e1);
//                 }
//             })
    
//             return result;
//         };

//         return collections;
//     });

// })();
