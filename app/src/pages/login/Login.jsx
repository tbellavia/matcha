import React, { useEffect, useState } from "react";
import Background from "../../components/ui/background/Background";
import Page from "../page/Page";
import Input from "../../components/ui/input/Input";
import Form from "../../components/ui/form/Form";
import Alert from "../../components/ui/alert/Alert";
import { validateEmail } from "../../utils/validation";
import { ERROR_MAIL, ERROR_PASSWORD } from "../../utils/messages";
import useErrors from "../../hooks/use-error-msg";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const errorManager = useErrors();

    const onMailHandler = (value) => {
        setEmail(value);
    }

    const onMailValidate = (value) => {
        if (!validateEmail(value)) {
            errorManager.addError(ERROR_MAIL);
        }
        else {
            errorManager.removeError(ERROR_MAIL);
        }
    }

    const onPasswordHandler = (value) => {
        setPassword(value);
    }

    const onPassWordValidate = (value) => {
        if (!value) {
            errorManager.addError(ERROR_PASSWORD);
        } else {
            errorManager.removeError(ERROR_PASSWORD);
        }
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log(`Login: ${email} Password: ${password}`)
    }

    let errorAlert;

    if (errorManager.errors.length !== 0) {
        const [errorMsg] = errorManager.errors;

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
                    />
                    <Input
                        label="mot de passe"
                        type="password"
                        value={password}
                        onChange={onPasswordHandler}
                        onBlur={onPassWordValidate}
                    />
                    {errorAlert}
                </Form>
            </Background>
        </Page>
    );
}

export default Login;