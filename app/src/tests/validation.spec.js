import { getMinAge } from "../common/utils";
import {
    validateBio,
    validateDate,
    validateGender,
    validateLocation,
    validatePhoto,
    validatePhotos,
    validateTags 
} from "../common/validation";

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
            { "lat": 48.8566, "lng": 2.3522 },
            { "lat": 43.7034, "lng": 7.2663 },
            { "lat": 43.6045, "lng": 1.444  }
        ];

        validLocations.forEach(location => {
            expect(validateLocation(location)).toBeTruthy();
        });
    });

    it("returns false with invalid location", () => {
        const invalidLocations = [
            {},
            // Missing one key
            { "lat": 48.8566 },
            { "lng": 48.8566 },
            // Value of invalid type
            { "lat": 43.6045, "lng": "1.444" },
            { "lat": "43.6045", "lng": 1.444 },
            { "lat": "43.6045", "lng": "1.444" },
            // Invalid value
            123
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
            expect(validateTags(tags)).toBeFalsy();
        });
    });
});

function createFile(filename, type, content = "") {
    const blob = new Blob([content], { type });
    return new File([blob], filename, { type });
}

describe("validate a photo correctly", () => {
    it("returns true if photo is valid", () => {
        const validPhotos = [
            createFile("1.jpeg", "image/jpeg"),
            createFile("2.jpg", "image/jpg"),
            createFile("3.png", "image/png"),
        ];

        validPhotos.forEach(photo => {
            expect(validatePhoto(photo)).toBeTruthy();
        })
    });

    it("returns false if photo is invalid", () => {
        const invalidPhotos = [
            createFile("1.pdf", "application/jpeg"),
            createFile("2.json", "application/json"),
            createFile("3.mp3", "audio/mpeg"),
        ];

        invalidPhotos.forEach(photo => {
            expect(validatePhoto(photo)).toBeFalsy();
        })
    });
});

describe("validate photos correctly", () => {
    it("returns true with valid photos", () => {
        const validPhotos = [
            // Jpeg
            [createFile("1.jpeg", "image/jpeg"), createFile("2.jpeg", "image/jpeg"), createFile("3.jpeg", "image/jpeg"), createFile("4.jpeg", "image/jpeg"), createFile("5.jpeg", "image/jpeg")],
            [createFile("1.jpeg", "image/jpeg"), createFile("2.jpeg", "image/jpeg"), createFile("3.jpeg", "image/jpeg"), createFile("4.jpeg", "image/jpeg")],
            [createFile("1.jpeg", "image/jpeg"), createFile("2.jpeg", "image/jpeg"), createFile("3.jpeg", "image/jpeg")],
            [createFile("1.jpeg", "image/jpeg"), createFile("2.jpeg", "image/jpeg")],
            // jpg
            [createFile("1.jpg", "image/jpg"), createFile("2.jpg", "image/jpg"), createFile("3.jpg", "image/jpg"), createFile("4.jpg", "image/jpg"), createFile("5.jpg", "image/jpg")],
            [createFile("1.jpg", "image/jpg"), createFile("2.jpg", "image/jpg"), createFile("3.jpg", "image/jpg"), createFile("4.jpg", "image/jpg")],
            [createFile("1.jpg", "image/jpg"), createFile("2.jpg", "image/jpg"), createFile("3.jpg", "image/jpg")],
            [createFile("1.jpg", "image/jpg"), createFile("2.jpg", "image/jpg")],
            // png
            [createFile("1.png", "image/png"), createFile("2.png", "image/png"), createFile("3.png", "image/png"), createFile("4.png", "image/png"), createFile("5.png", "image/png")],
            [createFile("1.png", "image/png"), createFile("2.png", "image/png"), createFile("3.png", "image/png"), createFile("4.png", "image/png")],
            [createFile("1.png", "image/png"), createFile("2.png", "image/png"), createFile("3.png", "image/png")],
            [createFile("1.png", "image/png"), createFile("2.png", "image/png")],
        ];

        validPhotos.forEach(photos => {
            expect(validatePhotos(photos)).toBeTruthy();
        });
    });
});