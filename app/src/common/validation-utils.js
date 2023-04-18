/**
 * Get age.
 * Get the age with the given birthDate given in parameter.
 * @param {Date} birthDate  A date object representing birth date
 * @returns                 An integer representing the age 
 */
export function getAge(birthDate) {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}