import Page from "../page/Page";
import Background from "../../components/ui/background/Background";
import Form from "../../components/ui/form/Form";
import Input from "../../components/ui/input/Input";
import { useEffect, useRef, useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation";

function Signup() {
    const [email, setEmail] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [validationPassword, setValidationPassword] = useState({ value: "", valid: false });
    const [formIsValid, setFormIsValid] = useState(false);
    // const [errorMsg, setErrorMsg] = useState("");
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

    const emailChange = (value) => {
        // Check if email doesn't already exists
        setEmail({ value: value, valid: validateEmail(value) });
    }

    const passwordChange = (value) => {
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
                </Form>
            </Background>
        </Page>
    );
}

export default Signup;