'use strict';

var thisModule = angular.module('pipSystemInfo', []);

thisModule.factory('pipSystemInfo', function ($rootScope, $window) {

    return {
        getBrowserName: getBrowserName,
        getBrowserVersion: getBrowserVersion,
        getPlatform: getPlatform,
        isDesktop: isDesktop,
        isMobile: isMobile,
        isCordova: isCordova,
        getOS: getOS,            
        isSupported: isSupported
    };

    // todo add support for iPhone
    function getBrowserName() {
        var ua = $window.navigator.userAgent;

        if (ua.search(/Edge/) > -1) return "edge";
        if (ua.search(/MSIE/) > -1) return "ie";
        if (ua.search(/Trident/) > -1) return "ie";
        if (ua.search(/Firefox/) > -1) return "firefox";
        if (ua.search(/Opera/) > -1) return "opera";
        if (ua.search(/OPR/) > -1) return "opera";
        if (ua.search(/YaBrowser/) > -1) return "yabrowser";
        if (ua.search(/Chrome/) > -1) return "chrome";
        if (ua.search(/Safari/) > -1) return "safari";
        if (ua.search(/Maxthon/) > -1) return "maxthon";
        
        return "unknown";
    }

    function getBrowserVersion() {
        var browser, version;
        var ua = $window.navigator.userAgent;

        browser = getBrowserName();

        switch (browser) {
            case "edge":
                version = (ua.split("Edge")[1]).split("/")[1];
                break;
            case "ie":
                version = (ua.split("MSIE ")[1]).split(";")[0];
                break;
            case "ie11":
                browser = "ie";
                version = (ua.split("; rv:")[1]).split(")")[0];
                break;
            case "firefox":
                version = ua.split("Firefox/")[1];
                break;
            case "opera":
                version = ua.split("Version/")[1];
                break;
            case "operaWebkit":
                version = ua.split("OPR/")[1];
                break;
            case "yabrowser":
                version = (ua.split("YaBrowser/")[1]).split(" ")[0];
                break;
            case "chrome":
                version = (ua.split("Chrome/")[1]).split(" ")[0];
                break;
            case "safari":
                version = (ua.split("Version/")[1]).split(" ")[0];
                break;
            case "maxthon":
                version = ua.split("Maxthon/")[1];
                break;
        }

        return version;
    }
    
    function getPlatform() {
        var ua = $window.navigator.userAgent;

        if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase())) 
            return 'mobile';

        return 'desktop';
    }

    function isDesktop() {
        return getPlatform() == 'desktop';
    }

    function isMobile() {
        return getPlatform() == 'mobile';
    }

    // Todo: complete implementation
    function isCordova() {
        return null;
    }

    function getOS() {
        var ua = $window.navigator.userAgent;

        try {
            var osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [ua])[0].replace('sunos', 'solaris'),
            osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
            return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
        } catch (err) {
            return 'unknown'
        }
    }

    // Todo: Move to errors
    function isSupported(supported) {
        if (!supported) supported = {
            edge: 11,
            ie: 11,
            firefox: 43, //4, for testing
            opera: 35,
            chrome: 47
        };

        var browser = getBrowserName();
        var version = getBrowserVersion();
        version = version.split(".")[0]

        if (browser && supported[browser] && version >= supported[browser]) 
            return true;

        return true;
    };

});

