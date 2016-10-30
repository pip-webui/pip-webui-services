'use strict';

import { Translation } from './Translation';
import { ITranslateService } from './TranslateService';
import { TranslateService } from './TranslateService';

export interface ITranslateProvider extends ITranslateService, ng.IServiceProvider {
}

export class TranslateProvider extends Translation implements ITranslateProvider {
    private _translation: Translation;
    private _setRootVar: boolean = true;
    private _persist: boolean = true;
    private _service: TranslateService;
    
    public constructor() {
        super();
    }

    public get setRootVar(): boolean {
        return this._setRootVar;  
    }

    public set setRootVar(value: boolean) {
        this._setRootVar = !!value;
    }

    public get persist(): boolean {
        return this._persist;  
    }

    public set persist(value: boolean) {
        this._persist = !!value;
    }

    public $get(
        $rootScope: ng.IRootScopeService,
        $log: ng.ILogService, 
        $window: ng.IWindowService
    ): any {
        "ngInject";

        if (this._service == null) 
            this._service = new TranslateService(this, this._setRootVar, this._persist, $rootScope, $log, $window);

        return this._service;
    }
}
