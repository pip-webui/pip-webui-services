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


function pipTranslateDirective(pipTranslate: any): ng.IDirective;
function pipTranslateHtmlDirective(pipTranslate: any): ng.IDirective;

function translateFilter(pipTranslate: any): (key: any) => any;
function optionalTranslateFilter($injector: any): (key: any) => any;

export const LanguageRootVar: string;
export const LanguageChangedEvent: string;
export interface ITranslateService {
    language: string;
    use(language: string): string;
    setTranslations(language: string, translations: any): void;
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
