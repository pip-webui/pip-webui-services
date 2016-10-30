'use strict';

import { TranslateProvider } from './TranslateProvider';
import { translateFilter } from './TranslateFilter';
import { translateDirective } from './TranslateDirective';
import { translateHtmlDirective } from './TranslateDirective';

angular
    .module('pipTranslate', [])
    .provider('pipTranslate', TranslateProvider)
    .filter('translate', translateFilter)
    .directive('pipTranslate', translateDirective)
    .directive('pipTranslateHtml', translateHtmlDirective);
