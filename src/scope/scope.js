
 /* global angular */

(function () {
    'use strict';

    angular.module('pipScope', ['pipScope.Error', 'pipScope.Transaction']);
    angular.module('pipTransactions', ['pipScope']);

})();