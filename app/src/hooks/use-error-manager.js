import React from "react";

// Error type
const ErrorTypes = Object.freeze({
    Network:    Symbol("network"),
    Input:      Symbol("input"),
});

export default function useErrorManager() {
    const [errors, setErrors] = React.useState(new Map());

    // Function to add an error
    const addError = (error, type, ref) => {
        setErrors((prevErrors) => new Map([...prevErrors, [error, {type, ref}]]));
    };

    // Function to add an error of type input error
    const addInputError = (error, ref) => {
        addError(error, ErrorTypes.Input, ref);
    }

    // Function to add an error of type network error
    const addNetworkError = (error) => {
        addError(error, ErrorTypes.Network, null);
    }

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
    const hasErrors = (type) => {
        if (type){
            return Array
                    .from(errors)
                    .filter(el => el[1].type === type)
                    .length > 0;
        }
        return errors.size > 0;
    }

    // Function to check if there are errors of type network
    const hasNetworkErrors = () => {
        return hasErrors(ErrorTypes.Network);
    }

    // Function to check if there are errors of type input
    const hasInputErrors = () => {
        return hasErrors(ErrorTypes.Input);
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
            first[1].ref.current.focus();
        }
    }

    return {
        errors: Array.from(errors),
        addError,
        addInputError,
        addNetworkError,
        removeError,
        clearErrors,
        hasErrors,
        hasNetworkErrors,
        hasInputErrors,
        getFirstError,
        focusOnError
    };
}


