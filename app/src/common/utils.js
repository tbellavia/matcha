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
