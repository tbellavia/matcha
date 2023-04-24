import { isEqualArray, isSameArray } from "../common/utils";

describe("compare equal array correctly", () => {
    it("returns true with equal array", () => {
        const equalArrays = [
            { a: [], b: [] },
            { a: [1], b: [1] },
            { a: ["tony"], b: ["tony"] },
            { a: [1, 'a'], b: [1, 'a'] },
        ];

        equalArrays.forEach(({ a, b }) => {
            expect(isEqualArray(a, b)).toBeTruthy();
        })
    });

    it("returns false with non-equal array", () => {
        const nonEqualArrays = [
            { a: [], b: [1] },
            { a: [1], b: [] },
            { a: ['1'], b: [1] },
            { a: ["tony", "mainhi"], b: ["tony", "tony"] },
        ];

        nonEqualArrays.forEach(({ a, b }) => {
            expect(isEqualArray(a, b)).toBeFalsy();
        })
    });
});

describe("compare same array correctly", () => {
    it("returns true with same array", () => {
        const sameArrays = [
            { a: [], b: [] },
            { a: [1], b: [1] },
            { a: ["mainhi", "tony"], b: ["tony", "mainhi"] },
            { a: ['a', 1], b: [1, 'a'] },
        ];

        sameArrays.forEach(({ a, b }) => {
            expect(isSameArray(a, b)).toBeTruthy();
        })
    });

    it("returns false with different array", () => {
        const differentArrays = [
            { a: [], b: [1] },
            { a: [1], b: [] },
            { a: ['1'], b: [1] },
            { a: ["tony", "mainhi"], b: ["tony", "tony"] },
        ];

        differentArrays.forEach(({ a, b }) => {
            expect(isSameArray(a, b)).toBeFalsy();
        })
    });
});