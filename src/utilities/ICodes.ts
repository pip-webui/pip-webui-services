export interface ICodes {
    // Simple version of string hashcode
    hash(value: string): number;
    // Generates random big number for verification codes
    verification(): string;
}