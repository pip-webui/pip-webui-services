export interface ITranslateService {
    language: string;

    use(language: string): string;
    setTranslations(language: string, translations: any): void;
    translations(language: string, translations: any): void;

    translate(key: string): string;
    translateArray(keys: string[]): string[];
    translateSet(keys: string[], keyProp: string, valueProp: string): any[];
    translateObjects(items: any[], keyProp: string, valueProp: string): any[];
    translateWithPrefix(prefix: string, key: string);
    translateSetWithPrefix(prefix: string, keys: string[], keyProp: string, valueProp: string);
    translateSetWithPrefix2(prefix: string, keys: string[], keyProp: string, valueProp: string);
}

export interface ITranslateProvider extends ITranslateService, ng.IServiceProvider {
    setRootVar: boolean;
    persist: boolean;
}
