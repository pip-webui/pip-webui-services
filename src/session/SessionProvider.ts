'use strict';

import { SessionService } from './SessionService';

export interface ISessionProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    session: any;
}

export class SessionProvider implements ISessionProvider {
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
