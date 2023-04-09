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

    return {
        errors: Array.from(errors),
        addError,
        removeError,
        clearErrors,
    };
}


