import React, { useRef, useState } from "react";
import Background from "../../components/ui/background/Background";
import GenericPage from "../page/GenericPage";
import Input from "../../components/ui/input/Input";
import Form from "../../components/ui/form/Form";
import Alert from "../../components/ui/alert/Alert";
import { validateEmail } from "../../common/validation";
import { ERROR_MAIL, ERROR_PASSWORD } from "../../common/messages";
import useErrorManager from "../../hooks/use-error-manager";
import useLogin from "../../hooks/use-login";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const errManager = useErrorManager();
    const emailRef = useRef();
    const passwordRef = useRef();
    const login = useLogin();

    const onMailHandler = (value) => {
        setEmail(value);
    }
    
    const onMailValidate = (value) => {
        if (!validateEmail(value)) {
            errManager.addInputError(ERROR_MAIL, emailRef);
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
            errManager.addInputError(ERROR_PASSWORD, passwordRef);
        } else {
            errManager.removeError(ERROR_PASSWORD);
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (errManager.hasInputErrors()){
            errManager.focusOnError();
        }
        else {
            try {
                await login(email, password);
            } catch (e) {
                errManager.addNetworkError(e.response.data.message);
                emailRef.current.focus();
            }
        }
    }

    let errorAlert;

    if (errManager.hasErrors()) {
        errorAlert = (
            <Alert>
                <p>{ errManager.getFirstError() }</p>
            </Alert>
        )
    }

    return (
        <GenericPage>
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
        </GenericPage>
    );
}

export default Login;