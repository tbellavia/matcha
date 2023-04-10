import React from "react";


export default function useErrorManager() {
    const [errors, setErrors] = React.useState(new Map());

    // Function to add an error
    const addError = (error, ref) => {
        setErrors((prevErrors) => new Map([...prevErrors, [error, ref]]));
    };

    // Function to remove an error
    const removeError = (error) => {
        setErrors((prevErrors) => {
            const newErrors = new Map(prevErrors);
            newErrors.delete(error);
            return newErrors;
        });
    };

    // Function to clear all errors
    const clearErrors = () => {
        setErrors(new Map());
    };

    // Function to check if there are any errors
    const hasErrors = () => {
        return errors.size > 0;
    }

    // Function to get first error
    const getFirstError = () => {
        const [first] = Array.from(errors);

        if (first)
            return first[0];
        return undefined;
    }

    // Function to focus on first error
    const focusOnError = () => {
        const [first] = errors;

        if (first && first[1]) {
            first[1].current.focus();
        }
    }

    return {
        errors: Array.from(errors),
        addError,
        removeError,
        clearErrors,
        hasErrors,
        getFirstError,
        focusOnError
    };
}


