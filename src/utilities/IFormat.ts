export interface IFormat {
    // Creates a sample line from a text
    sample(value: string, maxLength: number): string;

    sprintf(message: string, ...args: any[]): string;

    filterToString(filter: any): string;
    arrayToString(array: string[]): string;
    enumToArray(obj: any): any[];
}