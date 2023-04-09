import React, { useRef, useState } from "react";
import Background from "../../components/ui/background/Background";
import Page from "../page/Page";
import Input from "../../components/ui/input/Input";
import Form from "../../components/ui/form/Form";
import Alert from "../../components/ui/alert/Alert";
import { validateEmail } from "../../utils/validation";
import { ERROR_MAIL, ERROR_PASSWORD } from "../../utils/messages";
import useErrorManager from "../../hooks/use-error-manager";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const errManager = useErrorManager();
    const { errors } = errManager;
    const formValid = errors.length === 0;
    const emailRef = useRef();
    const passwordRef = useRef();

    const onMailHandler = (value) => {
        setEmail(value);
    }
    
    const onMailValidate = (value) => {
        if (!validateEmail(value)) {
            errManager.addError(ERROR_MAIL, emailRef);
        }
        else {
            errManager.removeError(ERROR_MAIL);
        }
    }

    const onPasswordHandler = (value) => {
        setPassword(value);
    }

    const onPassWordValidate = (value) => {
        if (!value) {
            errManager.addError(ERROR_PASSWORD, passwordRef);
        } else {
            errManager.removeError(ERROR_PASSWORD);
        }
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (!formValid){
            const [[,ref]] = errors;
            ref.current.focus();
            console.log("Form is not valid!");
            return;
        } 
        console.log(`Form is valid: ${formValid}`);
        console.log(`Login: ${email} Password: ${password}`)
    }

    let errorAlert;

    if (errors.length !== 0) {
        const [[errorMsg]] = errors;

        errorAlert = (
            <Alert>
                <p>{errorMsg}</p>
            </Alert>
        )
    }

    return (
        <Page>
            <Background paddingTop={2} title="connexion">
                <Form onSubmit={onSubmitHandler} label="valider">
                    <Input
                        label="mail"
                        type="email"
                        value={email}
                        onChange={onMailHandler}
                        onBlur={onMailValidate}
                        ref={emailRef}
                    />
                    <Input
                        label="mot de passe"
                        type="password"
                        value={password}
                        onChange={onPasswordHandler}
                        onBlur={onPassWordValidate}
                        ref={passwordRef}
                    />
                    {errorAlert}
                </Form>
            </Background>
        </Page>
    );
}

export default Login;