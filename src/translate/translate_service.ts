/// <reference path="../../typings/tsd.d.ts" />

module pip.translate {
    'use strict';

    export const LanguageRootVar = "$language";
    export const LanguageChangedEvent = "pipLanguageChanged";    

    export interface ITranslateService {
        language: string;

        use(language: string): string;
        setTranslations(language: string, translations: any): void;

        translate(key: string): string;
        translateArray(keys: string[]): string[];
        translateSet(keys: string[], keyProp: string, valueProp: string): any[];
        translateObjects(items: any[], keyProp: string, valueProp: string): any[];
        translateWithPrefix(prefix: string, key: string);
        translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string);
        translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string);
    }

    export interface ITranslateProvider extends ITranslateService, ng.IServiceProvider {

    }

    class Translation implements ITranslateService {
        protected _language = 'en';
        protected _translations = {
            en: {
                'en': 'English',
                'ru': 'Russian',
                'es': 'Spanish',
                'pt': 'Portuguese',
                'de': 'German',
                'fr': 'French'
            },
            ru: {
                'en': 'Английский',
                'ru': 'Русский',
                'es': 'Испанский',
                'pt': 'Португальский',
                'de': 'Немецкий',
                'fr': 'Французский'
            }
        };

        public constructor() {}

        public get language(): string { return this._language; }
        public set language(value: string) { this._language = value; }

        public use(language: string): string {
            if (language != null)
                this._language = language;
            return this._language;
        }

        // Set translation strings for specific language
        public setTranslations(language: string, translations: any): void {
            let map = this._translations[language] || {};
            this._translations[language] = _.extend(map, translations);
        }

        // Translate a string by key using set language
        public translate(key: string): string {
            if (_.isNull(key) || _.isUndefined(key)) return '';

            let translations = this._translations[this._language] || {};
            return translations[key] || key;
        }

        // Translate an array of strings
        public translateArray(keys: string[]): string[] {
            if (_.isNull(keys) || keys.length == 0) return [];

            let values = [];
            let translations = this._translations[this._language] || {};

            _.each(keys, function (k) {
                let key = k || '';
                values.push(translations[key] || key);
            });

            return values;
        }

        // Translate an array of strings into array of objects (set)
        public translateSet(keys: string[], keyProp: string, valueProp: string): any[] {
            if (_.isNull(keys) || keys.length == 0) return [];

            keyProp = keyProp || 'id';
            valueProp = valueProp || 'name';

            let values: any[] = [];
            let translations = this._translations[this._language] || {};

            _.each(keys, function (key) {
                let value: any = {};
                key = key || '';

                value[keyProp] = key;
                value[valueProp] = translations[key] || key;

                values.push(value);
            });

            return values;
        }

        // Translate a collection of objects
        public translateObjects(items: any[], keyProp: string, valueProp: string): any[] {
            if (_.isNull(items) || items.length == 0) return [];

            keyProp = keyProp || 'name';
            valueProp = valueProp || 'nameLocal';

            let translations = this._translations[this._language] || {};

            _.each(items, function (item) {
                let key = item[keyProp] || '';

                item[valueProp] = translations[key] || key;
            });

            return items;
        }

        // Translate a string by key  with prefix using set language todo
        public translateWithPrefix(prefix: string, key: string) {
            prefix = prefix ? prefix + '_' : '';
            key = (prefix + key).replace(/ /g, '_').toUpperCase();
            if (key == null) return '';
            let translations = this._translations[this._language] || {};
            return translations[key] || key;
        };

        public translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string) {
            if (_.isNull(keys) || keys.length == 0) return [];

            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() : '';
            keyProp = keyProp || 'id';
            valueProp = valueProp || 'name';

            let values = [];
            let translations = this._translations[this._language] || {};

            _.each(keys, function (key) {
                let value: any = {}; 
                key = key || '';

                value[keyProp] = key;
                value[valueProp] = translations[prefix + '_' + key] || key;

                values.push(value);
            });

            return values;
        }

        // Translate an array of strings, apply uppercase and replace ' ' => '_'
        public translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string) {
            if (_.isNull(keys) || keys.length == 0) return [];

            keyProp = keyProp || 'id';
            valueProp = valueProp || 'name';
            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() + '_': '';

            let values = [];
            let translations = this._translations[this._language] || {};

            _.each(keys, function (key) {
                let value: any = {};
                key = key || '';

                value[keyProp] = key;
                value[valueProp] = translations[prefix + key.replace(/ /g, '_').toUpperCase()]
                    || (prefix + key.replace(/ /g, '_').toUpperCase());

                values.push(value);
            });

            return values;
        }
    }

    class TranslateService {
        private _translation: Translation;
        private _setRootVar: boolean;
        private _persist: boolean;
        private _rootScope: ng.IRootScopeService;
        private _storage: any;

        public constructor(
            translation: Translation,
            setRootVar: boolean,
            persist: boolean,
            $rootScope: ng.IRootScopeService,
            localStorageService: any
        ) {
            this._setRootVar = setRootVar;
            this._persist = persist;
            this._translation = translation;
            this._rootScope = $rootScope;
            this._storage = localStorageService;

            if (this._persist) {
                this._translation.language = localStorageService.get('language') 
                    || this._translation.language;
            }

            this.save();
        }

        private save(): void {
            if (this._setRootVar)
                this._rootScope[pip.translate.LanguageRootVar] = this._translation.language;

            if (this._persist)
                this._storage.set('language', this._translation.language);
        }

        public get language(): string {
            return this._translation.language;
        }

        public set language(value: string) {
            if (value != this._translation.language) {
                this._translation.language = value;
                
                this.save();                
                this._rootScope.$broadcast(pip.translate.LanguageChangedEvent, value);
            }
        }

        public use(language: string): string {
            if (language != null)
                this.language = language;
            return this.language;
        }

        public setTranslations(language: string, translations: any): void {
            return this._translation.setTranslations(language, translations);
        }

        public translate(key: string): string {
            return this._translation.translate(key);
        }

        public translateArray(keys: string[]): string[] {
            return this._translation.translateArray(keys);
        }
        
        public translateSet(keys: string[], keyProp: string, valueProp: string): any[] {
            return this._translation.translateSet(keys, keyProp, valueProp);
        }

        public translateObjects(items: any[], keyProp: string, valueProp: string): any[] {
            return this._translation.translateObjects(items, keyProp, valueProp);
        }

        public translateWithPrefix(prefix: string, key: string) {
            return this._translation.translateWithPrefix(prefix, key);
        }

        public translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string) {
            return this._translation.translateSetWithPrefix(prefix, keys, keyProp, valueProp);
        }

        public translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string) {
            return this._translation.translateSetWithPrefix2(prefix, keys, keyProp, valueProp);
        }
    }

    class TranslateProvider extends Translation implements ITranslateProvider {
        private _translation: Translation;
        private _setRootVar: boolean;
        private _persist: boolean;
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
            localStorageService: any
        ): any {
            "ngInject";

            if (this._service == null) 
                this._service = new TranslateService(this, this._setRootVar, this._persist, $rootScope, localStorageService);
            return this._service;
        }
    }

    angular
        .module('pipTranslate.Service', [])
        .provider('pipTranslate', TranslateProvider);

}