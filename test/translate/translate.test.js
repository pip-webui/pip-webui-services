//
//  @file translate module its
//  @copyright Digital Living Software Corp. 2014-2016


describe('pipTranslate', function() {

    describe('provider block', function () {
        var $rootScope,
            localStorageService,
            provider,
            service;

        beforeEach(module('pipTranslate', function (pipTranslateProvider) {
            provider = pipTranslateProvider;
        }));

        beforeEach(module('LocalStorageModule'));

        beforeEach(inject(function (_$rootScope_, _localStorageService_, pipTranslate) {
            $rootScope = _$rootScope_;
            localStorageService = _localStorageService_;
            service = pipTranslate;
        }));
//
        var
            english = 'en',
            russian = 'ru',
            stringName = 'STRING',
            enString = 'String',
            ruString = '������',
            enStrings = {},
            ruStrings = {};
        enStrings[stringName] = enString;
        ruStrings[stringName] = ruString;

        it('use, language', function (done) {

            provider.translations(english, enStrings);
            provider.translations(russian, ruStrings);

            provider.language(english);
            assert.strictEqual(service.translate(stringName), enString, 'pipTranslate.translate should return translated string in language which was installed by provider.language');

            provider.setRoot(true);
            service.use(russian);
            assert.strictEqual($rootScope.$language, russian, 'pipTranslate.use should set $rootScope.$language if setRoot equal to true');
            assert.strictEqual(localStorageService.get('language'), russian);

            done();
        });

        it('translate', function (done) {
            provider.translations(english, enStrings);
            provider.translations(russian, ruStrings);

            provider.language(english);
            assert.strictEqual(service.translate(stringName), enString, 'pipTranslate.translate should return translated string');

            provider.setRoot(true);
            service.use(russian);

            assert.strictEqual(service.translate(stringName), ruString, 'pipTranslate.translate should return translated string');

            done();
        });

    });

});