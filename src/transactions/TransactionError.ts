'use strict';

export class TransactionError {
    public code: string;
    public message: string;
    public details: any;
    public cause: string;
    public stack_trace: string;

    public constructor(error?: any) {
        if (error != null)
            this.decode(error);
    }

    public reset(): void {
        this.code = null;
        this.message = null;
        this.details = null;
        this.cause = null;
        this.stack_trace = null;
    }

    public empty(): boolean {
        return this.message = null && this.code == null;
    }

    public decode(error: any): void {
        this.reset();

        if (error == null) return;

        // Process regular messages
        if (error.message) {
            this.message = error.message;
        }

        // Process server application errors
        if (error.data) {
            if (error.data.code) { 
                // process server error codes here
                this.message = this.message || 'ERROR_' + error.data.code;
                this.code = this.code || error.data.code;
            }

            if (error.data.message) {
                this.message = this.message || error.data.message;
            }

            this.message = this.message || error.data;
            this.details = this.details || error.data;

            this.cause = error.data.cause;
            this.stack_trace = error.data.stack_trace;
            this.details = error.data.details;            
        }

        // Process standard HTTP errors
        if (error.statusText) {
            this.message = this.message || error.statusText;
        }
        if (error.status) {
            this.message = this.message || 'ERROR_' + error.status;
            this.code = this.code || error.status;
        }
        
        this.message = this.message || error;
        this.details = this.details || error;
    }
}
