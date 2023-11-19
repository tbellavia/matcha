import {ERROR_MAIL, ERROR_PASSWORD, ERROR_VALIDATION_PASSWORD} from "./messages";

export function validateEmail(email) {
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return String(email).toLowerCase().match(emailRe) !== null;
};

export function validatePassword(password) {
    const passwordRe = /^(?=.*[!@#$&?])(?=.*\d)(?=.*[A-Z])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,20}$/;

    return passwordRe.test(password);
}

export function formValidateEmail(email) {
    return validateEmail(email) || ERROR_MAIL;
}

export function formValidatePassword(password) {
    return validatePassword(password) || ERROR_PASSWORD;
}

export function formValidateConfirmationPassword(password, confirmation) {
    return password === confirmation || ERROR_VALIDATION_PASSWORD;
}