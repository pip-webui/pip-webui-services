'use strict';

function configureTransactionStrings($injector: ng.auto.IInjectorService) {
    "ngInject";

    let pipTranslate:pip.services.ITranslateService = $injector.has('pipTranslateProvider') ? <pip.services.ITranslateService>$injector.get('pipTranslateProvider') : null;

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
