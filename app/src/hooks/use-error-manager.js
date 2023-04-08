import React from "react";


export default function useErrorManager() {
    const [errors, setErrors] = React.useState(new Set());

    // Function to add an error
    const addError = (error) => {
        setErrors((prevErrors) => new Set([...prevErrors, error]));
    };

    // Function to remove an error
    const removeError = (error) => {
        setErrors((prevErrors) => {
            const newErrors = new Set(prevErrors);
            newErrors.delete(error);
            return newErrors;
        });
    };

    // Function to clear all errors
    const clearErrors = () => {
        setErrors(new Set());
    };

    return {
        errors: Array.from(errors),
        addError,
        removeError,
        clearErrors,
    };
}


