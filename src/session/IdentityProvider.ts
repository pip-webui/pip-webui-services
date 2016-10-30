'use strict';

import { IIdentity } from './IdentityService';
import { IdentityService } from './IdentityService';

export interface IIdentityProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    identity: IIdentity;
}

export class IdentityProvider implements IdentityProvider {
    private _setRootVar = true;
    private _identity: IIdentity = null;
    private _service: IdentityService = null;

    public constructor() { }

    public get setRootVar(): boolean {
        return this._setRootVar;  
    }

    public set setRootVar(value: boolean) {
        this._setRootVar = !!value;
    }

    public get identity(): any {
        return this._identity;  
    }

    public set identity(value: any) {
        this._identity = value;
    }

    public $get(
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService
    ): any {
        "ngInject";

        if (this._service == null)
            this._service = new IdentityService(this._setRootVar, this._identity, $rootScope, $log);

        return this._service;
    }

}
