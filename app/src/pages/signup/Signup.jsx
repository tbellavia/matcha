import Page from "../page/Page";
import Background from "../../components/ui/background/Background";
import Form from "../../components/ui/form/Form";
import Input from "../../components/ui/input/Input";
import { useEffect, useRef, useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation";
import Alert from "../../components/ui/alert/Alert";
import useDebounce from "../../hooks/use-debounce";

function Signup() {
    const [email, setEmail] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [validationPassword, setValidationPassword] = useState({ value: "", valid: false });
    const [formIsValid, setFormIsValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const emailRef = useRef();
    const passwordRef = useRef();
    const validationPasswordRef = useRef();

    useEffect(() => {
        setValidationPassword(prev => {
            return { 
                ...prev, 
                valid: (prev.value === password.value && prev.value.length > 0)
            };
        });
    }, [password.value, validationPassword.value])
    
    useEffect(() => {
        setFormIsValid(email.valid && password.valid && validationPassword.valid);
    }, [email.valid, password.valid, validationPassword.valid]);

    useEffect(() => {
        if (password.value !== validatePassword.value && validationPassword.value.length > 0) {
            setErrorMsg("Validation password mismatch!");
        } else {
            setErrorMsg("");
        }
    }, [validationPassword.value]);

    const emailChange = (value) => {
        // Check if email doesn't already exists
        const isValid = validateEmail(value);

        if (!isValid)
            setErrorMsg("Mail is not valid!");
        else
            setErrorMsg("");
        setEmail({ value: value, valid: isValid });
    }

    const passwordChange = (value) => {
        const isValid = validatePassword(value);

        if (!isValid)
            setErrorMsg("Password must be at least 6 characters long \nand have at leat one special character '@&$!#?'");
        else
            setErrorMsg("");
        setPassword({ value: value, valid: validatePassword(value) });
    }

    const validationPasswordChange = (value) => {
        setValidationPassword({ value: value, valid: false })
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (!formIsValid) {
            console.log("Form is not valid!");
            if (!email.valid) {
                emailRef.current.focus();
            } else if (!password.valid) {
                passwordRef.current.focus();
            } else if (!validationPassword.valid) {
                validationPasswordRef.current.focus();
            }
            return;
        }
        console.log("Form is valid!");
    }

    let errorAlert;

    if (!formIsValid && errorMsg ) {
        errorAlert = (
            <Alert>
                <p>{errorMsg}</p>
            </Alert>
        )
    }

    return (
        <Page>
            <Background paddingTop={2} title="inscription">
                <Form label="valider" onSubmit={onSubmitHandler}>
                    <Input
                        label="mail"
                        type="email"
                        value={email.value}
                        onChange={emailChange}
                        ref={emailRef} 
                    />
                    <Input 
                        label="mot de passe"
                        type="password"
                        value={password.value}
                        onChange={passwordChange} 
                        ref={passwordRef}
                    />
                    <Input
                        label="confirmation"
                        type="password"
                        value={validationPassword.value}
                        onChange={validationPasswordChange} 
                        ref={validationPasswordRef}
                    />
                    {errorAlert}
                </Form>
            </Background>
        </Page>
    );
}

export default Signup;