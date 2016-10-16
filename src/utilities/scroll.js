/**
 * @file Page scrolling functions
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global _, $, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipScroll', []);

    thisModule.factory('pipScroll', function () {
        return {
            scrollTo: scrollTo
        };
        
        //-------------------------------------

        function scrollTo(parentElement, childElement, animationDuration) {
            if(!parentElement || !childElement) return;
            if (animationDuration == undefined) animationDuration = 300;

            setTimeout(function () {
                if (!$(childElement).position()) return;
                var modDiff= Math.abs($(parentElement).scrollTop() - $(childElement).position().top);
                if (modDiff < 20) return;
                var scrollTo = $(parentElement).scrollTop() + ($(childElement).position().top - 20);
                if (animationDuration > 0)
                    $(parentElement).animate({
                        scrollTop: scrollTo + 'px'
                    }, animationDuration);
            }, 100);
        }

    });

})();
