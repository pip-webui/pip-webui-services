/**
 * @file Translatation service
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
 /* global _, angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipTranslate.Service', ['LocalStorageModule', 'pipAssert']);

    thisModule.provider('pipTranslate', function(pipAssertProvider) {
        var 
            language = 'en',
            persist = true,
            setRoot = true,
            translationMap = {
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

        this.translations = setTranslations;
        this.language = initLanguage;
        this.use = initLanguage;
        this.persist = initPersist;
        this.setRoot = initSetRoot;

        this.$get = function ($rootScope, $timeout, localStorageService, pipAssert) {
            // Read language from persistent storage
            if (persist)
                language = localStorageService.get('language') || language;

            // Set root variable
            if (setRoot) 
                $rootScope.$language = language;
            
            // Resetting root scope to force update language on the screen
            function resetContent(fullReset, partialReset) {
                fullReset = fullReset !== undefined ? !!fullReset : true;
                partialReset = partialReset !== undefined ? !!partialReset : true;

                $rootScope.$reset = fullReset;
                $rootScope.$partialReset = partialReset;
                $timeout(function() {
                    $rootScope.$reset = false;
                    $rootScope.$partialReset = false;
                }, 0);
            }

            function setLanguage(newLanguage, fullReset, partialReset) {
                pipAssert.isString(newLanguage || '', "pipTranslate.use: argument should be a string");

                if (newLanguage != null && newLanguage != language) {
                    language = newLanguage;
                    
                    if (persist)
                        localStorageService.set('language', language);
                    if (setRoot)
                        $rootScope.$language = language;
                    
                    // Resetting content.
                    resetContent(fullReset, partialReset);

                    // Sending notification
                    $rootScope.$broadcast('pipLanguageChanged', newLanguage);
                }
                return language;
            }

            return {
                use: setLanguage,

                translations: setTranslations,
                translate: translate,
                translateArray: translateArray,
                translateSet: translateSet,
                translateObjects: translateObjects,
                translateById: translateById,
                translateSetById: translateSetById,
                translateStringsSet: translateStringsSet
            }
        };

        // Initialize language selection
        function initLanguage(newLanguage) {
            pipAssertProvider.isString(newLanguage || '', "pipTranslateProvider.use or pipTranslateProvider.language: argument should be a string");

            if (newLanguage != null) {
                language = newLanguage;
            }
            return language;
        }

        // Initialize persistence flag
        function initPersist(newPersist) {
            if (newPersist != null) {
                pipAssertProvider.isBoolean(newPersist || '', "pipTranslateProvider.persist: argument should be a boolean");
                persist = newPersist;
            }
            return persist;
        }

        // Initialize set root flag
        function initSetRoot(newSetRoot) {
            if (newSetRoot != null) {
                pipAssertProvider.isBoolean(newSetRoot || '', "pipTranslateProvider.setRoot: argument should be a boolean");
                setRoot = newSetRoot;
            }
            return setRoot;  
        }

        // Set translation strings for specific language
        function setTranslations(language, languageMap) {
            pipAssertProvider.isString(language, "pipTranslate.setTranslations or pipTranslateProvider.translations: first argument should be a string");
            pipAssertProvider.isObject(languageMap, "pipTranslate.setTranslations or pipTranslateProvider.translations: second argument should be an object");

            var map = translationMap[language] || {};
            translationMap[language] = _.extend(map, languageMap);
        }

        // Translate a string by key using set language
        function translate(key) {
            if (_.isNull(key) || _.isUndefined(key)) return '';

            var map = translationMap[language] || {};
            return map[key] || key;
        }

        // Translate an array of strings
        function translateArray(keys) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateArray: argument should be an array");

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var key = k || '';
                values.push(map[key] || key);
            });

            return values;
        }

        // Translate an array of strings into array of objects (set)
        function translateSet(keys, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSet: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSet: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSet: third argument should be a string");

            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate a collection of objects
        function translateObjects(items, key, value) {
            if (_.isNull(items) || items.length == 0) return [];

            pipAssertProvider.isArray(items, "pipTranslate.translateObjects: first argument should be an array");
            pipAssertProvider.isString(key || '', "pipTranslate.translateObjects: second argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateObjects: third argument should be a string");

            key = key || 'name';
            value = value || 'nameLocal';

            var map = translationMap[language] || {};

            _.each(items, function (i) {
                var item = i, mapKey = item[key] || '';

                item[value] = map[mapKey] || mapKey;
            });

            return items;
        }

        // Translate a string by key  with prefix using set language todo
        function translateById(prefix, key) {
            pipAssertProvider.isString(key || '', "pipTranslate.translateById: second argument should be a string");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateById: first argument should be a string");

            prefix = prefix ? prefix + '_' : '';
            key = (prefix + key).replace(/ /g, '_').toUpperCase();
            if (key == null) return '';
            var map = translationMap[language] || {};
            return map[key] || key;
        };

        function translateSetById(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateSetById: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateSetById: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateSetById: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateSetById: forth argument should be a string");

            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() : '';
            key = key || 'id';
            value = value || 'name';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';

                obj[key] = mapKey;
                obj[value] = map[prefix + '_' + mapKey] || mapKey;

                values.push(obj);
            });

            return values;
        }

        // Translate an array of strings, apply uppercase and replace ' ' => '_'
        function translateStringsSet(keys, prefix, key, value) {
            if (_.isNull(keys) || keys.length == 0) return [];

            pipAssertProvider.isArray(keys, "pipTranslate.translateStringsSet: first argument should be an array");
            pipAssertProvider.isString(prefix || '', "pipTranslate.translateStringsSet: second argument should be a string");
            pipAssertProvider.isString(key || '', "pipTranslate.translateStringsSet: third argument should be a string");
            pipAssertProvider.isString(value || '', "pipTranslate.translateStringsSet: forth argument should be a string");

            key = key || 'id';
            value = value || 'name';
            prefix = prefix ? prefix.replace(/ /g, '_').toUpperCase() + '_': '';

            var values = [];
            var map = translationMap[language] || {};

            _.each(keys, function (k) {
                var obj = {}, mapKey = k || '';
                obj[key] = mapKey;
                obj[value] = map[prefix + mapKey.replace(/ /g, '_').toUpperCase()]
                    || (prefix + mapKey.replace(/ /g, '_').toUpperCase());

                values.push(obj);
            });

            return values;
        }
    });

})();