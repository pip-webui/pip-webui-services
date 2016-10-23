/// <reference path="../../typings/tsd.d.ts" />

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