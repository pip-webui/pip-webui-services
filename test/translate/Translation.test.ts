'use strict';

import { assert } from 'chai';

import { Translation } from '../../src/translate';

suite('Translation', ()=> {

    test('language', () => {
        let translate = new Translation();

        // Default language
        assert.equal('en', translate.language);

        translate.language = 'ru';
        assert.equal('ru', translate.language); 
   });

});
