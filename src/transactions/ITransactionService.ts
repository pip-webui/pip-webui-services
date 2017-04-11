import { Transaction } from './Transaction';

export interface ITransactionService {
    create(scope?: string): Transaction;
    get(scope?: string): Transaction;
}
