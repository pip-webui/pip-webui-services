import { Translation } from './Translation';
import { ResetPageEvent } from '../utilities/PageResetService';
import { ITranslateService, ITranslateProvider } from './ITranslateService';

export let LanguageRootVar = "$language";
export let LanguageChangedEvent = "pipLanguageChanged";    

class TranslateService implements ITranslateService {
    private _translation: Translation;
    private _setRootVar: boolean;
    private _persist: boolean;
    private _rootScope: ng.IRootScopeService;
    private _log: ng.ILogService;
    private _window: ng.IWindowService;
    private _mdDateLocale: angular.material.IDateLocaleProvider;

    public constructor(
        translation: Translation,
        setRootVar: boolean,
        persist: boolean,
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService,
        $window: ng.IWindowService,
        $mdDateLocale: angular.material.IDateLocaleProvider,
    ) {
        this._setRootVar = setRootVar;
        this._persist = persist;
        this._translation = translation;
        this._rootScope = $rootScope;
        this._log = $log;
        this._window = $window;
        this._mdDateLocale = $mdDateLocale;

        if (this._persist && this._window.localStorage)
            this._translation.language = this._window.localStorage.getItem('language') || this._translation.language;

        this._log.debug("Set language to " + this._translation.language);

        this.save();
    }

    private changeLocale(locale: string) {
        if (!locale) return;

        // var localeDate: moment.MomentLanguageData;
        var localeDate: any;

        moment.locale(locale);
        localeDate = moment.localeData();

        this._mdDateLocale.months = angular.isArray(localeDate._months) ? localeDate._months : localeDate._months.format;
        this._mdDateLocale.shortMonths = angular.isArray(localeDate._monthsShort) ? localeDate._monthsShort : localeDate._monthsShort.format;
        this._mdDateLocale.days = angular.isArray(localeDate._weekdays) ? localeDate._weekdays : localeDate._weekdays.format;
        this._mdDateLocale.shortDays = localeDate._weekdaysMin;
        this._mdDateLocale.firstDayOfWeek = localeDate._week.dow;
    }

    private save(): void {
        if (this._setRootVar)
            this._rootScope[LanguageRootVar] = this._translation.language;

        if (this._persist && this._window.localStorage != null)
            this._window.localStorage.setItem('language', this._translation.language);
    }

    public get language(): string {
        return this._translation.language;
    }

    public set language(value: string) {
        if (value != this._translation.language) {
            this._translation.language = value;
            
            this._log.debug("Changing language to " + value);

            this.changeLocale(this._translation.language);
            this.save();   

            this._rootScope.$emit(LanguageChangedEvent, value);
            this._rootScope.$emit(ResetPageEvent);
        }
    }

    public use(language: string): string {
        if (language != null)
            this.language = language;
        return this.language;
    }

    public setTranslations(language: string, translations: any): void {
        return this._translation.setTranslations(language, translations);
    }

    public translations(language: string, translations: any): void {
        return this._translation.setTranslations(language, translations);
    }

    public translate(key: string): string {
        return this._translation.translate(key);
    }

    public translateArray(keys: string[]): string[] {
        return this._translation.translateArray(keys);
    }
    
    public translateSet(keys: string[], keyProp: string, valueProp: string): any[] {
        return this._translation.translateSet(keys, keyProp, valueProp);
    }

    public translateObjects(items: any[], keyProp: string, valueProp: string): any[] {
        return this._translation.translateObjects(items, keyProp, valueProp);
    }

    public translateWithPrefix(prefix: string, key: string) {
        return this._translation.translateWithPrefix(prefix, key);
    }

    public translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string) {
        return this._translation.translateSetWithPrefix(prefix, keys, keyProp, valueProp);
    }

    public translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string) {
        return this._translation.translateSetWithPrefix2(prefix, keys, keyProp, valueProp);
    }
}

class TranslateProvider extends Translation implements ITranslateProvider {
    private _translation: Translation;
    private _setRootVar: boolean = true;
    private _persist: boolean = true;
    private _service: TranslateService;
    
    public constructor() {
        super();
    }

    public get setRootVar(): boolean {
        return this._setRootVar;  
    }

    public set setRootVar(value: boolean) {
        this._setRootVar = !!value;
    }

    public get persist(): boolean {
        return this._persist;  
    }

    public set persist(value: boolean) {
        this._persist = !!value;
    }

    public $get(
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService, 
        $window: ng.IWindowService,
        $mdDateLocale: angular.material.IDateLocaleProvider
    ): any {
        "ngInject";

        if (this._service == null) 
            this._service = new TranslateService(this, this._setRootVar, this._persist, $rootScope, $log, $window, $mdDateLocale);

        return this._service;
    }
}

function initTranslate(pipTranslate: ITranslateService) {
    pipTranslate.language;
}

angular
    .module('pipTranslate')
    .provider('pipTranslate', TranslateProvider)
    .run(initTranslate);
