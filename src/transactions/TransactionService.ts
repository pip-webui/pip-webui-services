import { Transaction } from './Transaction';
import { ITransactionService } from './ITransactionService';

class TransactionService implements ITransactionService {
    private _transactions: Transaction = <Transaction>{};

    public constructor() {}

    public create(scope?: string): Transaction {
        let transaction: Transaction = new Transaction(scope);
        
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
