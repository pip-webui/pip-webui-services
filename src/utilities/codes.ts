'use strict';

export interface ICodes {
    // Simple version of string hashcode
    hash(value: string): number;
    // Generates random big number for verification codes
    verification(): string;
}


class Codes implements ICodes {
    // Simple version of string hashcode
    public hash(value: string): number {
        if (value == null) return 0;
        
        let result = 0;
        for (let i = 0; i < value.length; i++)
            result += value.charCodeAt(i);

        return result;
    }

    // Generates random big number for verification codes
    public verification(): string {
        return Math.random().toString(36).substr(2, 10).toUpperCase(); // remove `0.`
    }
}

angular
    .module('pipCodes', [])
    .service('pipCodes', Codes);
