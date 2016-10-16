/**
 * @file Global application timer service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTimer', []);

    thisModule.service('pipTimer', 
        function ($interval, $rootScope) {
            var 
                AUTO_PULL_CHANGES_TIMEOUT = 60000, // 1 min
                AUTO_UPDATE_PAGE_TIMEOUT = 15000,  // 15 sec
                AUTO_UPDATE_COLLECTION_TIMEOUT = 300000, // 5 min
                started = false, 
                autoPullChangesInterval, 
                autoUpdatePageInterval,
                autoUpdateCollectionInterval;

            return {
                isStarted: isStarted,
                start: start,
                stop: stop
            };

            //------------------------

            function isStarted() {
                return started;
            };

            function start() {
                if (started) return;

                autoPullChangesInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoPullChanges');
                }, AUTO_PULL_CHANGES_TIMEOUT);

                autoUpdatePageInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdatePage');
                }, AUTO_UPDATE_PAGE_TIMEOUT);

                autoUpdateCollectionInterval = $interval(function () {
                    $rootScope.$broadcast('pipAutoUpdateCollection');
                }, AUTO_UPDATE_COLLECTION_TIMEOUT);

                started = true;
            };

            function stop() {
                if (autoPullChangesInterval)
                    $interval.cancel(autoPullChangesInterval);

                if (autoUpdatePageInterval)
                    $interval.cancel(autoUpdatePageInterval);

                if (autoUpdateCollectionInterval)
                    $interval.cancel(autoUpdatePageInterval);

                started = false;
            };
        }
    );

})();
