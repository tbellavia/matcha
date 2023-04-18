import _ from "lodash";
import { getAge } from "./validation-utils";

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
