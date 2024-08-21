// src/helpers/handlebars-helpers.ts
export class HandlebarsHelpers {
    static eq(a: any, b: any): boolean {
        return a === b;
    }

    static gt(a: number, b: number): boolean {
        return a > b;
    }

    static lt(a: number, b: number): boolean {
        return a < b;
    }

    static add(a: number, b: number): number {
        return a + b;
    }

    static subtract(a: number, b: number): number {
        return a - b;
    }

    static range(start: number, end: number): number[] {
        const range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    }
}
