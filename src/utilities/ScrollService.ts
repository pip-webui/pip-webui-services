'use strict';

export interface IScrollService {
    scrollTo(parentElement, childElement, animationDuration): void;
}

class ScrollService implements IScrollService {

    public scrollTo(parentElement, childElement, animationDuration): void {
        if (!parentElement || !childElement) return;
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

}


angular
    .module('pipScroll', [])
    .service('pipScroll', ScrollService);
