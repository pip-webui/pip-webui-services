import { assert } from 'chai';
import { ngMock } from '../browser';

import { ITranslateService } from '../../src/translate/TranslateService';
import '../../src/translate/TranslateModule';

suite('TranslateFilter', ()=> {
    let _translateFilter: any;
    let _translateService: ITranslateService; 

    // Load angular modules
    setup(() => {
        ngMock.module('pipTranslate');
    });

    // Get all angular objects
    setup(ngMock.inject(function (translateFilter, pipTranslate) {
        _translateFilter = translateFilter;
        _translateService = pipTranslate;
    }));

    test('translate', () => {
        // English language
        _translateService.language = 'en'; 
        assert.equal('English', _translateFilter('en'));
        assert.equal('Russian', _translateFilter('ru'));

        // Russian language
        _translateService.language = 'ru'; 
        assert.equal('Английский', _translateFilter('en'));
        assert.equal('Русский', _translateFilter('ru'));
   });

});
