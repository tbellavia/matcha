import { getMinAge } from "../common/utils";
import { validateDate, validateGender } from "../common/validation";

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

describe("validate date correctly", () => {
    // A date is considered valid if it is at least the current date minus 18 years. (adult)
    it("returns true with valid date", () => {
        const validDates = [
            new Date(getMinAge()),
            new Date('2005-04-01'),
            new Date('1999-06-09'),
            new Date('1997-10-17'),
        ];

        validDates.forEach(date => {
            expect(validateDate(date)).toBeTruthy();
        });
    });

    it("returns false with invalid date", () => {
        const invalidDates = [
            new Date(), // Now
            new Date('2050-09-06'),
            new Date('2050-10-17'),
            "not a date object",
        ];

        invalidDates.forEach(date => {
            expect(validateDate(date)).toBeFalsy();
        });
    });
});