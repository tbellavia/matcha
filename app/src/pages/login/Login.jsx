import React, { useState } from "react";
import Background from "../../components/ui/background/Background";
import Page from "../page/Page";
import Input from "../../components/ui/input/Input";
import Button from "../../components/ui/button/Button";
import Form from "../../components/ui/form/Form";
import styles from "./Login.module.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onMailHandler = (value) => {
        setEmail(value);
    }

    const onPasswordHandler = (value) => {
        setPassword(value);
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log(`Login: ${email} Password: ${password}`)
    }

    return (
        <Page>
            <Background paddingTop={2} title="connexion">
                <Form onSubmit={onSubmitHandler} label="valider">
                    <Input label="mail" type="email" value={email} onChange={onMailHandler} />
                    <Input label="mot de passe" type="password" value={password} onChange={onPasswordHandler} />
                </Form>
            </Background>
        </Page>
    );
}

export default Login;