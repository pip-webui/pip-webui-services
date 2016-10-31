'use strict';

import { assert } from 'chai';

import { TransactionError } from '../../src/transactions/TransactionError';

suite('TransactionError', () => {

    test('decode', () => {
        let backendError = {
            message: 'error message',
            status: '1000'
        };

        let error = new TransactionError();
        error.decode(backendError);

        assert.strictEqual(backendError.message, error.message);
        assert.strictEqual(backendError.status, error.code);
        assert.deepEqual(backendError, error.details);
    });

});
