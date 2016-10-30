'use strict';

export class Translation {
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

    // Yet another method to set translation strings for specific language
    public translations(language: string, translations: any): void {
        this.setTranslations(language, translations);
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
