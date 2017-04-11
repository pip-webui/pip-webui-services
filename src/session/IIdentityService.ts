export interface IIdentityService {
    identity: any;
}

export interface IIdentityProvider extends ng.IServiceProvider {
    setRootVar: boolean;
    identity: any;
}
