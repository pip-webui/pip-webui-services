'use strict';

var thisModule = angular.module('pipTags', []);

thisModule.factory('pipTags', function () {
        
    return {
        equal: equal,
        normalizeOne: normalizeOne,
        normalizeAll: normalizeAll,
        normalize: normalizeAll,
        compressOne: compressOne,
        compressAll: compressAll,
        compress: compressAll,
        extract: extract
    };

    //------------------------------

    function normalizeOne(tag) {
        return tag 
            ? _.trim(tag.replace(/(_|#)+/g, ' '))
            : null;
    }

    function compressOne(tag) {
        return tag
            ? tag.replace(/( |_|#)/g, '').toLowerCase()
            : null;
    }

    function equal(tag1, tag2) {
        if (tag1 == null && tag2 == null)
            return true;
        if (tag1 == null || tag2 == null)
            return false;
        return compressOne(tag1) == compressOne(tag2);
    }

    function normalizeAll(tags) {
        if (_.isString(tags)) {
            tags = tags.split(/( |,|;)+/);
        }

        tags = _.map(tags, function (tag) {
            return normalizeOne(tag);
        });

        return tags;
    }

    function compressAll(tags) {
        if (_.isString(tags))
            tags = tags.split(/( |,|;)+/);

        tags = _.map(tags, function (tag) {
            return compressOne(tag);
        });

        return tags;
    };

    function extract(entity, searchFields) {
        var tags = normalizeAll(entity.tags);

        _.each(searchFields, function (field) {
            var text = entity[field] || '';

            if (text != '') {
                var hashTags = text.match(/#\w+/g);
                tags = tags.concat(normalizeAll(hashTags));
            }
        });

        return _.uniq(tags);
    }
});
