import { Buffer } from "buffer";

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
