import { validateGender } from "../common/validation";

describe("validate gender correctly", () => {
    it("returns true with valid genders", () => {
        const validGenders = ["homme", "femme", "non binaire"];

        validGenders.forEach(gender => {
            expect(validateGender(gender)).toBeTruthy();
        })
    });

    it("returns false with invalid genders", () => {
        const invalidGenders = ["mainhi", "tony", ""];

        invalidGenders.forEach(gender => {
            expect(validateGender(gender)).toBeFalsy();
        })
    })
});
