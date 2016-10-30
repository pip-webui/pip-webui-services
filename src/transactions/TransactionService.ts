'use strict';

import { Transaction } from './Transaction';

export interface ITransactionService {
    create(scope?: string): Transaction;
    get(scope?: string): Transaction;
}

class TransactionService implements TransactionService {
    private _transactions: any = {};

    public constructor() {}

    public create(scope?: string): Transaction {
        let transaction = new Transaction(scope);
        
        if (scope != null)
            this._transactions[scope] = transaction;

        return transaction;
    }

    public get(scope?: string): Transaction {
        let transaction: Transaction = scope != null ? <Transaction>this._transactions[scope] : null;

        if (transaction == null) {
            transaction = new Transaction(scope);
            if (scope != null)
                this._transactions[scope] = transaction;
        }

        return transaction;
    }
}

angular
    .module('pipTransaction')
    .service('pipTransaction', TransactionService);
