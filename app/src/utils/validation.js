export function validateEmail(email) {
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return String(email).toLowerCase().match(emailRe) !== null;
};

export function validatePassword(password) {
    const passwordRe = /^[\w|@|&|$|!|#|?]{6,20}$/;

    return passwordRe.test(password);
}
