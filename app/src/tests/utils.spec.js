import { encodePreferences, extractPreferences, isEqualArray, isSameArray } from "../common/utils";

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

describe("encode preferences correctly", () => {
    it.each([
        [[], 0],
        [["homme"], 1],
        [["femme"], 2],
        [["non-binaire"], 4],
        [["homme", "femme"], 3],
        [["femme", "homme"], 3],
        [["homme", "non-binaire"], 5],
        [["non-binaire", "homme"], 5],
        [["femme", "non-binaire"], 6],
        [["non-binaire", "femme"], 6],
        [["homme", "femme", "non-binaire"], 7],
        [["femme", "homme", "non-binaire"], 7],
        [["femme", "non-binaire", "homme"], 7],
        [["non-binaire", "femme", "homme"], 7],
        [["non-binaire", "homme", "femme"], 7],
    ])("passing %p should returns %p", (preferences, expected) => {
        expect(encodePreferences(preferences)).toEqual(expected);
    })

    it("should throw exception if preferences is not an array", () => {
        expect(() => encodePreferences("not an array")).toThrow(TypeError)
    })
});

describe("extract preferences correctly", () => {
    it.each([
        [{}, []],
        [{"homme": true}, ["homme"]],
        [{"femme": true}, ["femme"]],
        [{"non-binaire": true}, ["non-binaire"]],
        [{"homme": true, "femme": true}, ["homme", "femme"]],
        [{"homme": false, "femme": true}, ["femme"]],
        [{"homme": true, "femme": false}, ["homme"]],
        [{"homme": true, "femme": false, "non-binaire": false}, ["homme"]],
        [{"homme": false, "femme": true, "non-binaire": false}, ["femme"]],
        [{"homme": false, "femme": false, "non-binaire": true}, ["non-binaire"]],
        [{"homme": true, "femme": true, "non-binaire": true}, ["homme", "femme", "non-binaire"]],
        [{"homme": false, "femme": false, "non-binaire": false}, []],
    ])("passing %p should returns an array with only elements whose values are true %p", (preferences, expected) => {
        expect(extractPreferences(preferences)).toEqual(expect.arrayContaining(expected));
    })
})