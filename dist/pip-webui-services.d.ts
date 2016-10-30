declare module pip {






export let CurrentState: any;
export let PreviousState: any;

export let RedirectedStates: any;


export let RoutingVar: string;


var thisModule: ng.IModule;

var thisModule: ng.IModule;

export const IdentityRootVar: string;
export const IdentityChangedEvent: string;
export interface IIdentity {
    id: string;
    full_name: string;
    details: string;
    email: string;
    photo_url: string;
}
export interface IIdentityService {
    identity: IIdentity;
}
export interface IIdentityProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    identity: IIdentity;
}

export const SessionRootVar: string;
export const SessionOpenedEvent: string;
export const SessionClosedEvent: string;
export interface ISessionService {
    session: any;
    isOpened: boolean;
    open(session: any): void;
    close(): void;
}
export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}

export function translateDirective(pipTranslate: any): ng.IDirective;
export function translateHtmlDirective(pipTranslate: any): ng.IDirective;

export function translateFilter(pipTranslate: any): (key: any) => any;
export function optionalTranslateFilter($injector: any): (key: any) => any;




export interface ITranslateProvider extends ITranslateService, ng.IServiceProvider {
}
export class TranslateProvider extends Translation implements ITranslateProvider {
    private _translation;
    private _setRootVar;
    private _persist;
    private _service;
    constructor();
    setRootVar: boolean;
    persist: boolean;
    $get($rootScope: ng.IRootScopeService, $window: ng.IWindowService): any;
}


export let LanguageRootVar: string;
export let LanguageChangedEvent: string;
export interface ITranslateService {
    language: string;
    use(language: string): string;
    setTranslations(language: string, translations: any): void;
    translations(language: string, translations: any): void;
    translate(key: string): string;
    translateArray(keys: string[]): string[];
    translateSet(keys: string[], keyProp: string, valueProp: string): any[];
    translateObjects(items: any[], keyProp: string, valueProp: string): any[];
    translateWithPrefix(prefix: string, key: string): any;
    translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string): any;
    translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string): any;
}
export class TranslateService implements ITranslateService {
    private _translation;
    private _setRootVar;
    private _persist;
    private _rootScope;
    private _window;
    constructor(translation: Translation, setRootVar: boolean, persist: boolean, $rootScope: ng.IRootScopeService, $window: ng.IWindowService);
    private save();
    language: string;
    use(language: string): string;
    setTranslations(language: string, translations: any): void;
    translations(language: string, translations: any): void;
    translate(key: string): string;
    translateArray(keys: string[]): string[];
    translateSet(keys: string[], keyProp: string, valueProp: string): any[];
    translateObjects(items: any[], keyProp: string, valueProp: string): any[];
    translateWithPrefix(prefix: string, key: string): any;
    translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string): any[];
    translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string): any[];
}

export class Translation {
    protected _language: string;
    protected _translations: {
        en: {
            'en': string;
            'ru': string;
            'es': string;
            'pt': string;
            'de': string;
            'fr': string;
        };
        ru: {
            'en': string;
            'ru': string;
            'es': string;
            'pt': string;
            'de': string;
            'fr': string;
        };
    };
    constructor();
    language: string;
    use(language: string): string;
    setTranslations(language: string, translations: any): void;
    translations(language: string, translations: any): void;
    translate(key: string): string;
    translateArray(keys: string[]): string[];
    translateSet(keys: string[], keyProp: string, valueProp: string): any[];
    translateObjects(items: any[], keyProp: string, valueProp: string): any[];
    translateWithPrefix(prefix: string, key: string): any;
    translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string): any[];
    translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string): any[];
}

var thisModule: ng.IModule;



var thisModule: ng.IModule;



var thisModule: ng.IModule;

var thisModule: ng.IModule;

var thisModule: ng.IModule;

var thisModule: ng.IModule;

export interface ITimerService {
    isStarted: boolean;
    addEvent(event: string, timeout: number): void;
    removeEvent(event: string): void;
    clearEvents(): void;
    start(): void;
    stop(): void;
}



}
