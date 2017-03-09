import { ISystemInfo } from './ISystemInfo';


class SystemInfo implements ISystemInfo {
    private _window: ng.IWindowService;

    public constructor($window: ng.IWindowService) {
        "ngInject";

        this._window = $window;
    }

    // todo add support for iPhone
    public get browserName(): string {
        let ua = this._window.navigator.userAgent;

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

    public get browserVersion(): string {
        let version;
        let ua = this._window.navigator.userAgent;
        let browser = this.browserName;

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
    
    public get platform(): string {
        let ua = this._window.navigator.userAgent;

        if (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua.toLowerCase())) 
            return 'mobile';

        return 'desktop';
    }

    public get os(): string {
        let ua = this._window.navigator.userAgent;

        try {
            let osAll = (/(windows|mac|android|linux|blackberry|sunos|solaris|iphone)/.exec(ua.toLowerCase()) || [ua])[0].replace('sunos', 'solaris');
            let osAndroid = (/(android)/.exec(ua.toLowerCase()) || '');
            return osAndroid && (osAndroid == 'android' || (osAndroid[0] == 'android')) ? 'android' : osAll;
        } catch (err) {
            return 'unknown'
        }
    }

    public isDesktop(): boolean {
        return this.platform == 'desktop';
    }

    public isMobile(): boolean {
        return this.platform == 'mobile';
    }

    // Todo: complete implementation
    public isCordova(): boolean {
        return false;
    }

    // Todo: Move to errors
    public isSupported(supported?: any): boolean {
        if (!supported) 
            supported = {
                edge: 11,
                ie: 11,
                firefox: 43, //4, for testing
                opera: 35,
                chrome: 47
            };

        let browser = this.browserName;
        let version = this.browserVersion;
        version = version.split(".")[0]

        if (browser && supported[browser] && version >= supported[browser]) 
            return true;

        return true;
    }
}


angular
    .module('pipSystemInfo', [])
    .service('pipSystemInfo', SystemInfo);
