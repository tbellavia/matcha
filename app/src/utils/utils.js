export function getFirstError(errors) {
    let errorsKeys = Object.keys(errors);

    if (errorsKeys.length !== 0) {
        return errors[errorsKeys[0]].message;
    }
    return false;
}