'use strict';

import { assert } from 'chai';
import { ngMock } from '../browser';

import { ITags } from '../../src/utilities';
import '../../src/utilities';

suite('Tags', () => {
    let _tagsService: ITags;

    setup(ngMock.module('pipTags'));

    setup(ngMock.inject((pipTags) => {
        _tagsService = pipTags;
    }));
    
    test('extract tags', () => {
        let tagList = _tagsService.extract(
            {
                tags: ['Tag 1', 'tag_2', 'TAG3'],
                name: 'Text with tag1 #Tag1',
                description: 'Text with #tag_2,#tag3-#tag4 and #TAG__5'
            },
            ['name', 'description']
        );

        assert.includeMembers(tagList, ['Tag 1', 'tag 2', 'TAG3', 'Tag1', 'tag3', 'tag4', 'TAG 5']);
    });

});
