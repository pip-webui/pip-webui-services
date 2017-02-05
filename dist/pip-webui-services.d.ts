declare module pip.services {

export let IdentityRootVar: string;
export let IdentityChangedEvent: string;
export interface IIdentity {
    id: string;
    full_name: string;
    details: string;
    email: string;
    photo_url: string;
    groups: string[];
}
export interface IIdentityService {
    identity: any;
}
export interface IIdentityProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    identity: any;
}


export const SessionRootVar = "$session";
export const SessionOpenedEvent = "pipSessionOpened";
export const SessionClosedEvent = "pipSessionClosed";
export interface ISessionService {
    session: any;
    isOpened(): boolean;
    open(session: any): void;
    close(): void;
}
export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}

export let CurrentState: any;
export let PreviousState: any;


let RedirectedStates: any;
function decorateRedirectStateProvider($delegate: any): any;
function addRedirectStateProviderDecorator($provide: any): void;
function decorateRedirectStateService($delegate: any, $timeout: any): any;
function addRedirectStateDecorator($provide: any): void;

export let RoutingVar: string;

export interface ICodes {
    hash(value: string): number;
    verification(): string;
}

export interface IFormat {
    sample(value: string, maxLength: number): string;
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

export interface IScrollService {
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

export interface ITags {
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


function translateDirective(pipTranslate: any): ng.IDirective;
function translateHtmlDirective(pipTranslate: any): ng.IDirective;

function translateFilter(pipTranslate: any): (key: any) => any;
function optionalTranslateFilter($injector: any): (key: any) => any;

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
export interface ITranslateProvider extends ITranslateService, ng.IServiceProvider {
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


export class Transaction {
    private _scope;
    private _id;
    private _operation;
    private _error;
    private _progress;
    constructor(scope: string);
    readonly scope: string;
    readonly id: string;
    readonly operation: string;
    readonly progress: number;
    readonly error: TransactionError;
    readonly errorMessage: string;
    reset(): void;
    busy(): boolean;
    failed(): boolean;
    aborted(id: string): boolean;
    begin(operation: string): string;
    update(progress: number): void;
    abort(): void;
    end(error?: any): void;
}

export class TransactionError {
    code: string;
    message: string;
    details: any;
    cause: string;
    stack_trace: string;
    constructor(error?: any);
    reset(): void;
    empty(): boolean;
    decode(error: any): void;
}

export interface ITransactionService {
    create(scope?: string): Transaction;
    get(scope?: string): Transaction;
}

function configureTransactionStrings($injector: any): void;

}
