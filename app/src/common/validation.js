import _ from "lodash";
import { getAge } from "./validation-utils";
import { isSameArray } from "./utils";
import { cities } from "../utils/cities";
import Ajv from "ajv";

const genders = ["femme", "homme", "non binaire"];
const validateLocationSchema = new Ajv({ allErrors: true }).compile({
    type: "object",
    properties: {
        lat: { type: "number" },
        lng: { type: "number" },
    },
    required: ["lat", "lng"],
    additionalProperties: false,
});
const authorizedImageExtensions = [
    "image/jpeg",
    "image/jpg",
    "image/png",
];

export const authorizedImageExtensionsString = authorizedImageExtensions.join(",");

/**
 * Validate an email.
 * An email is considered valid if it is composed of one `@', and has TLD prefix.
 * @param {String} email    An email to validate
 * @returns                 A boolean, true if email is valid, false otherwise
 */
export function validateEmail(email) {
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return String(email).toLowerCase().match(emailRe) !== null;
};

/**
 * Validate a password.
 * A password is considered valid if it is a valid string, composed of at least 6 characters
 * and a maximum of 20 characters, has at least one special character, at least one uppercase
 * and one number.
 * @param {String} password A password to validate
 * @returns {Boolean}       A boolean, true if password is valid, false otherwise
 */
export function validatePassword(password) {
    const passwordRe = /^(?=.*[!@#$&?])(?=.*\d)(?=.*[A-Z])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,20}$/;

    return passwordRe.test(password);
}

/**
 * Validate a date.
 * A date is considered valid if it is an instance of Date object and if the date is 
 * at least the current year minus 18 years.
 * @param {Date}        date    A date object
 * @returns {Boolean}           A boolean, true if date is valid, false otherwise
 */
export function validateDate(date) {
    return _.isDate(date) && getAge(date) >= 18;
}

/**
 * Validate preferences.
 * A preferences object is considered valid if it contains all of the propositions,
 * and at least one of its field has a value of true.
 * @param   {Object}    preferences An object of the form {"homme": <bool>, "femme": <bool>, "non binaire": <bool>}
 * @returns {Boolean}               A boolean, true if preferences is valid, false otherwise
 */
export function validatePreferences(preferences) {
    const keys = Object.keys(preferences);
    const vals = Object.values(preferences);

    return !_.isEmpty(preferences) && isSameArray(genders, keys) && vals.some(val => val === true);
}

/**
 * Validate a gender.
 * A gender is considered valid if it belongs to at least one of the
 * following gender set : 'homme', 'femme' or 'non binaire'.
 * @param {String}      gender  The gender to validate.
 * @returns {Boolean}           A boolean, true if gender is valid, false otherwise
 */
export function validateGender(gender) {
    return genders.includes(gender);
}

/**
 * Validate a biography.
 * A biography is considered valid if it a string and has a size between 1 and 300
 * characters.
 * @param {String}      bio The biography to validate.
 * @returns {Boolean}       A boolean, true if biography is valid, false otherwise.
 */
export function validateBio(bio) {
    return _.isString(bio) && bio.length > 0 && bio.length <= 300;
}


/**
 * Validate a location.
 * A valid location is an object composed of the following fields : "city", "lat", "lng", "region" and
 * that is present within the `cities.js` json map.
 * @param {Object}      location    A location object to validate. 
 * @returns {Boolean}               A boolean, true if location is valid, false otherwise.
 */
export function validateLocation(location) {
    return validateLocationSchema(location);
}

/**
 * Validate tags.
 * A valid tags is a non-empty array of non-empty strings.
 * @param {Array}       tags    A non-empty array of non-empty strings.
 * @returns {Boolean}           A boolean, true if tags is valid, false otherwise.    
 */
export function validateTags(tags) {
    return (
        _.isArray(tags) && 
        !_.isEmpty(tags) &&
        tags.every(tag => _.isString(tag) && !_.isEmpty(tag))
    );
}

/**
 * Validate a photo.
 * A valid photo is a javascript File object with one of the following MIME type : image/jpeg, image/jpg, image/png.
 * @param {File}        photo   A photo to validate.
 * @returns {Boolean}           A boolean, true if photo is valid, false otherwise.
 */
export function validatePhoto(photo) {
    return (photo instanceof File) && authorizedImageExtensions.includes(photo.type);
}

/**
 * Validate photos.
 * A valid photos, is a non-empty array composed of at least one image file
 * and a maximum of five images file.
 * @param {Array}       photos  A file array containing images only.
 * @returns {Boolean}           A boolean, true if photos is valid, false otherwise.
 */
export function validatePhotos(photos) {
    return (
        _.isArray(photos) && 
        photos.length > 1 && 
        photos.length <= 5 &&
        photos.every(photo => validatePhoto(photo))
    );
}