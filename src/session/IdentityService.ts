export let IdentityRootVar = "$identity";
export let IdentityChangedEvent = "pipIdentityChanged";

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


class IdentityService implements IIdentityService {
    private _identity: any;
    private _setRootVar: boolean;
    private _rootScope: ng.IRootScopeService;
    private _log: ng.ILogService;

    public constructor(
        setRootVar: boolean,
        identity: any,
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

    public get identity(): any {
        return this._identity;
    }

    public set identity(value: any) {
        this._identity = value;
        this.setRootVar();
        this._rootScope.$emit(IdentityChangedEvent, this._identity);

        let identity: any = value || {};
        this._log.debug("Changed identity to " + JSON.stringify(identity));
    }
}

class IdentityProvider implements IdentityProvider {
    private _setRootVar = true;
    private _identity: any = null;
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
