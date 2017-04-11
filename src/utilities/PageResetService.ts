import { IPageResetService } from './IPageResetService';


export let ResetPageEvent: string = "pipResetPage";
export let ResetAreaEvent: string = "pipResetArea";

export let ResetRootVar: string = "$reset";
export let ResetAreaRootVar: string = "$resetArea";


class PageResetService implements IPageResetService {
    private _rootScope: ng.IRootScopeService;
    private _log: ng.ILogService;
    private _timeout: ng.ITimeoutService;

    public constructor(
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService, 
        $timeout: ng.ITimeoutService
    ) {
        this._rootScope = $rootScope;
        this._log = $log;
        this._timeout = $timeout;

        $rootScope[ResetRootVar] = false;
        $rootScope[ResetAreaRootVar] = null;
    }

    public reset(): void {
        this._log.debug("Resetting the entire page");
        this.performReset(null);
    }

    public resetArea(area: string): void {
        this._log.debug("Resetting the area " + area);
        this.performReset(area);
    }

    private performReset(area?: string): void {
        this._rootScope[ResetRootVar] = area == null;
        this._rootScope[ResetAreaRootVar] = area;

        this._timeout(() => {
            this._rootScope[ResetRootVar] = false;
            this._rootScope[ResetAreaRootVar] = null;
        }, 0);
    }
}


function hookResetEvents(
    $rootScope: ng.IRootScopeService, 
    pipPageReset: IPageResetService
) {
    $rootScope.$on(ResetPageEvent, () => { pipPageReset.reset(); });
    $rootScope.$on(ResetAreaEvent, (event, area) => { pipPageReset.resetArea(area); });
}


angular.module('pipPageReset', [])
    .service('pipPageReset', PageResetService)
    .run(hookResetEvents);
