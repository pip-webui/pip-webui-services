import { assert } from 'chai';
import { ngMock } from '../browser';

import { ITransactionService } from '../../src/transactions';

suite('pipTransaction', () => {
    let _rootScope: ng.IRootScopeService;
    let _transactionService;

    setup(ngMock.module('pipTransaction'));

    setup(ngMock.inject((pipTransaction, $rootScope) => {
        _transactionService = pipTransaction;
        _rootScope = $rootScope;
    }));

    test('create transaction', () => {
        let transaction = _transactionService.create("test");

        assert.isObject(transaction);
        assert.equal("test", transaction.scope);
        assert.isNull(transaction.id);
    });

    test('begin transaction', () => {
        let transaction = _transactionService.create("test");
        let transactionId = transaction.begin("TESTING");

        assert.isDefined(transaction);
        assert.equal(transactionId, transaction.id);
        assert.isTrue(transaction.busy());
        assert.isNull(transaction.begin());
    });

    test('abort transaction', () => {
        let transaction = _transactionService.create("test");
        let transactionId = transaction.begin("TESTING");

        transaction.abort();
        assert.isTrue(transaction.aborted(transactionId));
    });

    test('end transaction', () => {
        let transaction = _transactionService.create("test");
        let transactionId = transaction.begin("TESTING");
        let backendError = {
            message: 'error message',
            status: '1000'
        };

        transaction.end(backendError);
        assert.isFalse(transaction.busy());
        assert.strictEqual(backendError.message, transaction.errorMessage);
        assert.isTrue(transaction.failed());
    });

});