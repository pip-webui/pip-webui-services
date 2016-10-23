/// <reference path="../../typings/tsd.d.ts" />

module pip.session {
    'use strict';

    export const SessionRootVar = "$session";
    export const SessionOpenedEvent = "pipSessionOpened";
    export const SessionClosedEvent = "pipSessionClosed";

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

    class SessionService implements ISessionService {
        private _setRootVar: boolean;
        private _session: any;
        private _rootScope: ng.IRootScopeService;

        public constructor(
            setRootVar: boolean, 
            session: any, 
            $rootScope: ng.IRootScopeService
        ) {
            this._setRootVar = setRootVar;
            this._session = session;
            this._rootScope = $rootScope;

            this.setRootVar();
        }
        
        private setRootVar(): void {
            if (this._setRootVar)
                this._rootScope[pip.session.SessionRootVar] = this._session;
        }

        public get session(): any {
            return this._session;
        }

        public get isOpened(): boolean {
            return this._session != null;
        }

        public open(session: any, fullReset: boolean = false, partialReset: boolean = false) {
            if (session == null)
                throw new Error("Session cannot be null");

            this._session = session;
            this.setRootVar();
            this._rootScope.$broadcast(pip.session.SessionOpenedEvent, session);
        }

        public close(fullReset: boolean = false, partialReset: boolean = false) {
            let oldSession = this._session;

            this._session = null;
            this.setRootVar();
            this._rootScope.$broadcast(pip.session.SessionClosedEvent, oldSession);
        }
    }

    class SessionProvider implements ISessionProvider {
        private _setRootVar = true;
        private _session: any = null;
        private _service: pip.session.ISessionService = null;

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

        public $get($rootScope: ng.IRootScopeService): any {
            "ngInject";

            if (this._service == null)
                this._service = new SessionService(this._setRootVar, this._session, $rootScope);

            return this._service;
        }
    }

    angular.module('pipSession', ['pipPageReset'])
        .provider('pipSession', SessionProvider); 
}