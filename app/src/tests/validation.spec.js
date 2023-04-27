import { getMinAge } from "../common/utils";
import { validateBio, validateDate, validateGender, validateLocation, validateTags } from "../common/validation";

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

describe("validate biography correctly", () => {
    it("returns true with valid bio", () => {
        const validBios = [
            "a",
            "x".repeat(300),
            "tony",
        ];
        
        validBios.forEach(bio => {
            expect(validateBio(bio)).toBeTruthy();
        })
    });

    it("returns false with invalid bio", () => {
        const invalidBios = [
            NaN,
            "",
            "1".repeat(301)
        ];

        invalidBios.forEach(bio => {
            expect(validateBio(bio)).toBeFalsy();
        })
    });
});

describe("validate location correctly", () => {
    it("returns true with valid location", () => {
        const validLocations = [
            { "city": "Paris", "lat": 48.8566, "lng": 2.3522, "region": "Île-de-France" },
            { "city": "Nice", "lat": 43.7034, "lng": 7.2663, "region": "Provence-Alpes-Côte d’Azur" },
            { "city": "Toulouse", "lat": 43.6045, "lng": 1.444, "region": "Occitanie" }
        ];

        validLocations.forEach(location => {
            expect(validateLocation(location)).toBeTruthy();
        });
    });

    it("returns false with invalid location", () => {
        const invalidLocations = [
            { },
            // Missing one key
            { "city": "Paris", "lat": 48.8566, "lng": 2.3522 },
            // Value of invalid type
            { "city": "Toulouse", "lat": "43.6045", "lng": "1.444", "region": "Occitanie" },
            // Invalid value
            123,
            // Inexistent city
            { "city": "Tony", "lat": "43.6045", "lng": "1.444", "region": "Occitanie" },
        ];

        invalidLocations.forEach(location => {
            expect(validateLocation(location)).toBeFalsy();
        });
    });
});

describe("validate tags correctly", () => {
    it("returns true with valid tags", () => {
        const validTagsArrays = [
            ["beer"],
            ["beer", "baseball"],
            ["beer", "baseball", "football"],
        ];

        validTagsArrays.forEach(tags => {
            expect(validateTags(tags)).toBeTruthy();
        });
    });
    
    it("return false with invalid tags", () => {
        const invalidTagsArrays = [
            [],
            [""],
            ["", ""],
            true,
            NaN
        ];
        
        invalidTagsArrays.forEach(tags => {
            console.log(tags);
            expect(validateTags(tags)).toBeFalsy();
        });
    });
});