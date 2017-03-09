export interface IFormat {
    // Creates a sample line from a text
    sample(value: string, maxLength: number): string;

    sprintf(message: string, ...args: any[]): string;
}