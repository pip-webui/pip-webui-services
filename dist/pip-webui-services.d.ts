declare module pip {





export let CurrentState: any;
export let PreviousState: any;
export function captureStateTranslations($rootScope: ng.IRootScopeService): void;
export function addBackStateDecorator($provide: any): void;

export let RedirectedStates: any;
export function addRedirectStateProviderDecorator($provide: any): void;
export function addRedirectStateDecorator($provide: any): void;

export let RoutingVar: string;
export function hookRoutingEvents($rootScope: ng.IRootScopeService, $log: ng.ILogService, $state: ng.ui.IStateService): void;



var thisModule: ng.IModule;

var thisModule: ng.IModule;


export interface IIdentityProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    identity: IIdentity;
}
export class IdentityProvider implements IdentityProvider {
    private _setRootVar;
    private _identity;
    private _service;
    constructor();
    setRootVar: boolean;
    identity: any;
    $get($rootScope: ng.IRootScopeService, $log: ng.ILogService): any;
}

export let IdentityRootVar: string;
export let IdentityChangedEvent: string;
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
export class IdentityService implements IIdentityService {
    private _identity;
    private _setRootVar;
    private _rootScope;
    private _log;
    constructor(setRootVar: boolean, identity: IIdentity, $rootScope: ng.IRootScopeService, $log: ng.ILogService);
    private setRootVar();
    identity: IIdentity;
}


export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}
export class SessionProvider implements ISessionProvider {
    private _setRootVar;
    private _session;
    private _service;
    constructor();
    setRootVar: boolean;
    session: any;
    $get($rootScope: ng.IRootScopeService, $log: ng.ILogService): any;
}

export const SessionRootVar: string;
export const SessionOpenedEvent: string;
export const SessionClosedEvent: string;
export interface ISessionService {
    session: any;
    isOpened(): boolean;
    open(session: any): void;
    close(): void;
}
export class SessionService implements ISessionService {
    private _setRootVar;
    private _session;
    private _rootScope;
    private _log;
    constructor(setRootVar: boolean, session: any, $rootScope: ng.IRootScopeService, $log: ng.ILogService);
    private setRootVar();
    readonly session: any;
    isOpened(): boolean;
    open(session: any, fullReset?: boolean, partialReset?: boolean): void;
    close(fullReset?: boolean, partialReset?: boolean): void;
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
    $get($rootScope: ng.IRootScopeService, $log: ng.ILogService, $window: ng.IWindowService): any;
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
    private _log;
    private _window;
    constructor(translation: Translation, setRootVar: boolean, persist: boolean, $rootScope: ng.IRootScopeService, $log: ng.ILogService, $window: ng.IWindowService);
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

export interface ICodes {
    hash(value: string): number;
    verification(): string;
}
export class Codes implements ICodes {
    hash(value: string): number;
    verification(): string;
}

export interface IFormat {
    sample(value: string, maxLength: number): string;
    sprintf(message: string, ...args: any[]): string;
}
export class Format implements IFormat {
    private cache;
    sample(value: string, maxLength: number): string;
    private strRepeat(str, qty);
    private getType(variable);
    private parseFormat(fmt);
    private format(parse_tree, argv);
    sprintf(message: string, ...args: any[]): string;
}

export let ResetPageEvent: string;
export let ResetAreaEvent: string;
export let ResetRootVar: string;
export let ResetAreaRootVar: string;
export interface IPageResetService {
    reset(): void;
    resetArea(area: string): void;
}
export class PageResetService implements IPageResetService {
    private _rootScope;
    private _log;
    private _timeout;
    constructor($rootScope: ng.IRootScopeService, $log: ng.ILogService, $timeout: ng.ITimeoutService);
    reset(): void;
    resetArea(area: string): void;
    private performReset(area?);
}
export function hookResetEvents($rootScope: ng.IRootScopeService, pipPageReset: IPageResetService): void;

export interface IScrollService {
    scrollTo(parentElement: any, childElement: any, animationDuration: any): void;
}
export class ScrollService implements IScrollService {
    scrollTo(parentElement: any, childElement: any, animationDuration: any): void;
}

export interface ISystemInfo {
    browserName: string;
    browserVersion: string;
    platform: string;
    os: string;
    isDesktop(): boolean;
    isMobile(): boolean;
    isCordova(): boolean;
    isSupported(supported?: any): boolean;
}
export class SystemInfo implements ISystemInfo {
    private _window;
    constructor($window: ng.IWindowService);
    readonly browserName: string;
    readonly browserVersion: string;
    readonly platform: string;
    readonly os: string;
    isDesktop(): boolean;
    isMobile(): boolean;
    isCordova(): boolean;
    isSupported(supported?: any): boolean;
}

export interface ITags {
    normalizeOne(tag: string): string;
    compressOne(tag: string): string;
    equal(tag1: string, tag2: string): boolean;
    normalizeAll(tags: any): string[];
    compressAll(tags: any): string[];
    extract(entity: any, searchFields?: string[]): string[];
}
export class Tags implements ITags {
    normalizeOne(tag: string): string;
    compressOne(tag: string): string;
    equal(tag1: string, tag2: string): boolean;
    normalizeAll(tags: any): string[];
    compressAll(tags: any): string[];
    extract(entity: any, searchFields?: string[]): string[];
}

export interface ITimerService {
    isStarted(): boolean;
    addEvent(event: string, timeout: number): void;
    removeEvent(event: string): void;
    clearEvents(): void;
    start(): void;
    stop(): void;
}
export class TimerService implements ITimerService {
    private _rootScope;
    private _log;
    private _interval;
    private _started;
    private _events;
    constructor($rootScope: ng.IRootScopeService, $log: ng.ILogService, $interval: ng.IIntervalService);
    isStarted(): boolean;
    addEvent(event: string, timeout: number): void;
    removeEvent(event: string): void;
    clearEvents(): void;
    private startEvent(event);
    private stopEvent(event);
    start(): void;
    stop(): void;
}


}
