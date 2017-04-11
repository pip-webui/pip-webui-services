import { ITranslateService } from '../translate/ITranslateService';

function configureTransactionStrings($injector: ng.auto.IInjectorService) {
    "ngInject";

    let pipTranslate: ITranslateService = $injector.has('pipTranslateProvider') 
        ? <ITranslateService>$injector.get('pipTranslateProvider') : null;

    if (pipTranslate) {
        pipTranslate.setTranslations('en', {
            'ENTERING': 'Entering...',
            'PROCESSING': 'Processing...',
            'LOADING': 'Loading...',
            'SAVING': 'Saving...'
        });

        pipTranslate.setTranslations('ru', {
            'ENTERING': 'Вход в систему...',
            'PROCESSING': 'Обрабатывается...',
            'LOADING': 'Загружается...',
            'SAVING': 'Сохраняется...'
        });   
    }
    
}

angular
    .module('pipTransaction')
    .config(configureTransactionStrings);
