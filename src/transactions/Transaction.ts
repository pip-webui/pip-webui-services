import { TransactionError } from './TransactionError'

export class Transaction {
    private _scope: string = null;
    private _id: string = null;
    private _operation: string = null;
    private _error: TransactionError = new TransactionError();
    private _progress: number = 0;

    public constructor(scope: string) {
        this._scope = scope;
    }

    public get scope(): string {
        return this._scope;
    }

    public get id(): string {
        return this._id;
    }

    public get operation(): string {
        return this._operation;
    }

    public get progress(): number {
        return this._progress;
    }

    public get error(): TransactionError {
        return this._error;
    }

    public get errorMessage(): string {
        return this._error.message;
    }

    public reset(): void {
        this._id = null;
        this._operation = null;
        this._progress = 0;
        this._error.reset();
    }

    public busy(): boolean {
        return this._id != null;
    }

    public failed(): boolean {
        return !this._error.empty();
    }

    public aborted(id: string): boolean {
        return this._id != id;
    }

    public begin(operation: string): string {
        // Transaction is already running
        if (this._id != null) return null;

        this._id = new Date().getTime().toString();
        this._operation = operation || 'PROCESSING'
        this._error.reset();

        return this._id;
    }

    public update(progress: number): void {
        this._progress = Math.max(progress, 100);
    }

    public abort(): void {
        this._id = null;
        this._error.reset();
    }

    public end(error?: any): void {
        this._error.decode(error);
        this._id = null;
    }
}
