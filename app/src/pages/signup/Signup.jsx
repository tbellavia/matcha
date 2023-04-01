import Page from "../page/Page";
import Background from "../../components/ui/background/Background";
import Form from "../../components/ui/form/Form";
import Input from "../../components/ui/input/Input";
import { useEffect, useRef, useState } from "react";
import { validateEmail, validatePassword } from "../../utils/validation";
import Alert from "../../components/ui/alert/Alert";
import useInput from "../../hooks/use-input";

function Signup() {
    const [email, setEmailValue, setEmailValid, resetEmail] = useInput("", false);
    const [password, setPasswordValue, setPasswordValid, resetPassword] = useInput("", false);
    const [
        validationPassword,
        setValidationPasswordValue,
        setValidationPasswordValid,
        resetValidationPassword
    ] = useInput("", false);
    const [formIsValid, setFormIsValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const emailRef = useRef();
    const passwordRef = useRef();
    const validationPasswordRef = useRef();


    useEffect(() => {
        setFormIsValid(email.valid && password.valid && validationPassword.valid);
    }, [email.valid, password.valid, validationPassword.valid])


    // =================== Email ===================

    const emailChange = (value) => {
        // TODO: Check if email doesn't already exists in database
        setEmailValue(value);
    }
    
    const onEmailValidate = (value) => {
        // Validate email
        const isValid = validateEmail(value);
        
        setEmailValid(isValid);
        if (!isValid)
            setErrorMsg("Le mail n'est pas valide");
        else
            setErrorMsg("");
    }

    // =================== Password ===================

    const passwordChange = (value) => {
        setPasswordValue(value);
    }
    
    const onPasswordValidate = (value) => {
        const isValid = validatePassword(value);
    
        setPasswordValid(isValid);
        if (!isValid)
            setErrorMsg("Le mot de passe doit contenir au moins 6 caractères et doit contenir au moins un caractère spécial suivant '@&$!#?'");
        else
            setErrorMsg("");
    }

    // =================== Confirmation ===================

    const validationPasswordChange = (value) => {
        setValidationPasswordValue(value);
    }

    const onValidationPasswordValidate = (value) => {
        const isValid = value === password.value && value.length > 0;

        setValidationPasswordValid(isValid);
        if (!isValid) {
            setErrorMsg("La confirmation ne correspond pas au mot de passe");
        } else {
            setErrorMsg("");
        }
    }

    // =================== Submit ===================

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (!formIsValid) {
            console.log("Form is not valid!");
            if (!email.valid) {
                emailRef.current.focus();
                onEmailValidate(email.value);
            } else if (!password.valid) {
                passwordRef.current.focus();
                onPasswordValidate(password.value);
            } else if (!validationPassword.valid) {
                onValidationPasswordValidate(validationPassword.value);
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
                        onBlur={onEmailValidate}
                        ref={emailRef} 
                    />
                    <Input 
                        label="mot de passe"
                        type="password"
                        value={password.value}
                        onChange={passwordChange} 
                        onBlur={onPasswordValidate}
                        ref={passwordRef}
                    />
                    <Input
                        label="confirmation"
                        type="password"
                        value={validationPassword.value}
                        onChange={validationPasswordChange} 
                        onBlur={onValidationPasswordValidate}
                        ref={validationPasswordRef}
                    />
                    {errorAlert}
                </Form>
            </Background>
        </Page>
    );
}

export default Signup;