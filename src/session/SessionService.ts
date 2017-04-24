import { ISessionService, ISessionProvider } from './ISessionService';

export const SessionRootVar = "$session";
export const SessionOpenedEvent = "pipSessionOpened";
export const SessionClosedEvent = "pipSessionClosed";

let async = require('async');

class SessionService implements ISessionService {
    private _setRootVar: boolean;
    private _session: any;
    private _rootScope: ng.IRootScopeService;
    private _log: ng.ILogService;
    private listeners: any = {};

    public constructor(
        setRootVar: boolean,
        session: any,
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService
    ) {
        this._setRootVar = setRootVar;
        this._session = session;
        this._rootScope = $rootScope;
        this._log = $log;

        this.setRootVar();
    }

    private fireListeners(type: string, callback: (error?: any, result?: any) => void): void {
        if (!type){  
            throw new Error("Event object missing 'type' property.");
        }

        if (this.listeners[type] instanceof Array){
            async.each(this.listeners[type], (listener, callback) => {
                listener(callback);
            }, callback);
        } else {
            callback();
        }
    }

    private fireOpenListeners(successCallback: () => void): void {
        this.fireListeners('open', (error: any, result: any) => {
            if (!error) {
                successCallback();
            } else {
                // reset session
                this._session = null;
                this._log.error(error);
                throw new Error('Session open error:');
            }
        });
    }

    private fireCloseListeners(successCallback: () => void): void {
        this.fireListeners('close', (error: any, result: any) => {
            if (!error) {
                successCallback();
            } else {
                this._log.error(error);
                throw new Error('Session close error:');
            }
        });
    }

    private setRootVar(): void {
        if (this._setRootVar)
            this._rootScope[SessionRootVar] = this._session;
    }

    private start(session: any): void {
        this.setRootVar();
        this._rootScope.$emit(SessionOpenedEvent, session);
        this._log.debug("Opened session " + session);
    }

    private stop(): void {
        let oldSession = this._session;

        this._session = null;
        this.setRootVar();
        this._rootScope.$emit(SessionClosedEvent, oldSession);

        this._log.debug("Closed session " + oldSession);
    }

    private addListener(type: string, listener: any): void {
        if (typeof this.listeners[type] == "undefined") {
            this.listeners[type] = [];
        }

        this.listeners[type].push(listener);
    }

    private removeListener(type: string, listener: any): void {
        if (this.listeners[type] instanceof Array) {
            var listeners = this.listeners[type];
            for (var i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    private clearListeners(type: string): void {
        this.listeners[type] = [];
    }

    public addOpenListener(listener: any): void {
        this.addListener('open', listener);
    }

    public addCloseListener(listener: any): void {
        this.addListener('close', listener);
    }

    public removeOpenListener(listener: any): void {
        this.removeListener('open', listener);
    }

    public removeCloseListener(listener: any): void {
        this.removeListener('close', listener);
    }

    public clearOpenListeners(): void {
        this.clearListeners('open')
    }

    public clearCloseListeners(): void {
        this.clearListeners('close')
    }

    public get session(): any {
        return this._session;
    }

    public isOpened(): boolean {
        return this._session != null;
    }

    public open(session: any) {
        if (session == null)
            throw new Error("Session cannot be null");

        this._session = session;

        this.fireOpenListeners(() => {
            this.start(session);
        });
    }

    public close() {
        if (this.session == null) { return }

        this.fireCloseListeners(() => {
            this.stop();
        });
    }
}

class SessionProvider implements ISessionProvider {
    private _setRootVar = true;
    private _session: any = null;
    private _service: SessionService = null;

    public constructor() { }

    public get setRootVar(): boolean {
        return this._setRootVar;
    }

    public set setRootVar(value: boolean) {
        this._setRootVar = !!value;
    }

    public get session(): any {
        return this._session;
    }

    public set session(value: any) {
        this._session = value;
    }

    public $get(
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService
    ): any {
        "ngInject";

        if (this._service == null)
            this._service = new SessionService(this._setRootVar, this._session, $rootScope, $log);

        return this._service;
    }
}

angular
    .module('pipSession')
    .provider('pipSession', SessionProvider); 
