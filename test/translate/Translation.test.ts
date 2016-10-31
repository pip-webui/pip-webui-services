// Example of angular-independent test

import { assert } from 'chai';
import { Translation } from '../../src/translate/Translation';

suite('Translation', ()=> {

    test('language', () => {
        let translate = new Translation();

        // Default language
        assert.equal('en', translate.language);

        translate.language = 'ru';
        assert.equal('ru', translate.language); 
   });

});
