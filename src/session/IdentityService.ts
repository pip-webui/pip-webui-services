'use strict';

export let IdentityRootVar = "$identity";
export let IdentityChangedEvent = "pipIdentityChanged";

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


class IdentityService implements IIdentityService {
    private _identity: IIdentity;
    private _setRootVar: boolean;
    private _rootScope: ng.IRootScopeService;
    private _log: ng.ILogService;

    public constructor(
        setRootVar: boolean,
        identity: IIdentity,
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService
    ) {
        this._setRootVar = setRootVar;
        this._identity = identity;
        this._rootScope = $rootScope;
        this._log = $log;

        this.setRootVar();
    }

    private setRootVar(): void {
        if (this._setRootVar)
            this._rootScope[IdentityRootVar] = this._identity;
    }

    public get identity(): IIdentity {
        return this._identity;
    }

    public set identity(value: IIdentity) {
        this._identity = value;
        this.setRootVar();
        this._rootScope.$emit(IdentityChangedEvent, this._identity);

        let identity: IIdentity = value || <IIdentity>{};
        this._log.debug("Changed identity to " + identity.id + " " + identity.full_name);
    }
}

class IdentityProvider implements IdentityProvider {
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

angular
    .module('pipSession')
    .provider('pipIdentity', IdentityProvider);
