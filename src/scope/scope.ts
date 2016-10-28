/// <reference path="../../typings/tsd.d.ts" />

module pip.scope {
    'use strict';

    angular.module('pipScope', ['pipTranslate', 'pipScope.Error', 'pipScope.Transaction']);
    angular.module('pipTransactions', ['pipScope']);

}