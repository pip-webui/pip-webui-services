'use strict';

import { assert } from 'chai';
import { ngMock } from '../browser';

import { IFormat } from '../../src/utilities';
import '../../src/utilities';

suite('Format', () => {
    let _formatService: IFormat;

    setup(ngMock.module('pipFormat'));

    setup(ngMock.inject((pipFormat) => {
        _formatService = pipFormat;
    }));
    
    test('sprintf', () => {
        let buf = "string"
        let str = _formatService.sprintf("here should be string: %s", buf);

        assert.equal(str, "here should be string: string");
    });

	test('make string', () => {
		let original = '123456789';
		let result = _formatService.sample(original, 5);
		assert.equal(result, '12345');
	});
});
