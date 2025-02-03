import { Buffer } from "buffer";
import _ from "lodash";

/**
 * Check if two arrays are equal.
 * Two array are considered equal if their size are equal and if every
 * element are equals.
 * @param {Array}       a An array
 * @param {Array}       b An array
 * @returns {Boolean}   A boolean, true if a and b are equal, false otherwise.
 */
export function isEqualArray(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let index = 0; index < a.length; ++index) {
        if (a[index] !== b[index]) return false;
    }
    return true;
}

/**
 * Check if two arrays are the same.
 * Two array are considered the same if their size are equal and when
 * sorted, their elements are equals.
 * @param {Array}       a An array
 * @param {Array}       b An array
 * @returns {Boolean}   A boolean, true if a and b are the same, false otherwise.
 */
export function isSameArray(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    const sortedA = a.sort();
    const sortedB = b.sort();

    for (let index = 0; index < sortedA.length; ++index) {
        if (sortedA[index] !== sortedB[index]) return false;
    }
    return true;
}

/**
 * Get minimum age date.
 * The minimum age date is the current date minus 18 years.
 * @returns {String}  A string, representing the minimum age date in the form 'yyyy-mm-dd'.
 */
export function getMinAge() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = "0" + dd;
      }
  
    if (mm < 10) {
        mm = "0" + mm;
      }

    return (yyyy-18) + "-" + mm + "-" + dd
}

/**
 * Transform file object to base64.
 */
export async function fileToBase64(file) {
    return Buffer.from(await file.arrayBuffer()).toString('base64');
}

export function base64ToFile(base64){
    return `data:image/jpeg;base64,${base64}`
}

export function removeEmptyString(arr) {
    return arr.filter(item => item.length > 0);
}

/**
 * Encode gender preferences on integer.
 * homme = 1, femme = 2, non-binaire = 4
 */
export function encodePreferences(preferences) {
    if (!_.isArray(preferences)){
        throw new TypeError("preferences must be of type array");
    }
    const genders = {"homme": 1, "femme": 2, "non-binaire": 4};
    let result = 0;

    for (const preference of preferences)
        result += genders[preference]
    return result > 0 ? result : 7;
}

export function decodePreferences(preferences) {
    // if (!_.isArray(preferences)){
    //     throw new TypeError("preferences must be of type array");
    // }
    const result = {"homme": false, "femme": false, "non-binaire": false};

    if (preferences & 1)
        result["homme"] = true;
    if (preferences & 1 << 1)
        result["femme"] = true;
    if (preferences & 1 << 2)
        result["non-binaire"] = true;
    return result;
}

export function extractPreferences(preferences) {
    const extractedPreferences = [];

    Object.entries(preferences).forEach(([gender, active]) => {
        if (active)
            extractedPreferences.push(gender);
    })
    return extractedPreferences;
}