import { useState } from "react";

function useInput(initialValue, initialValid) {
    const [_input, _setInput] = useState({
        value: initialValue,
        valid: initialValid,
    });

    const _setValue = (value) => {
        _setInput(prev => {
            return {
                ...prev,
                value: value,
            }
        });
    };

    const _setValid = (valid) => {
        _setInput(prev => {
            return {
                ...prev,
                valid: valid
            }
        });
    }

    const _reset = () => {
        _setInput({
            value: initialValue,
            valid: initialValid,
        });
    }
    return [_input, _setValue, _setValid, _reset];
}

export default useInput;