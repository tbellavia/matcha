import Page from "../page/Page";
import Background from "../../components/ui/background/Background";
import Form from "../../components/ui/form/Form";
import Input from "../../components/ui/input/Input";
import { useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import useErrorManager from "../../hooks/use-error-manager";
import { validateEmail, validatePassword } from "../../common/validation";
import { ERROR_MAIL, ERROR_PASSWORD, ERROR_VALIDATION_PASSWORD } from "../../common/messages";
import Alert from "../../components/ui/alert/Alert";
import axios from "axios";

function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const validationRef = useRef();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState("");
    const errManager = useErrorManager();

    // =================== Email ===================
    const onEmailChangeHandler = (value) => {
        setEmail(value);
    }

    const onEmailBlurHandler = (value) => {
        const emailIsValid = validateEmail(value);

        if (!emailIsValid) {
            errManager.addError(ERROR_MAIL, emailRef);
        } else {
            errManager.removeError(ERROR_MAIL);
        }
    }

    // =================== Password ===================
    const onPasswordChangeHandler = (value) => {
        setPassword(value);
    }

    const onPasswordBlurHandler = (value) => {
        const passwordIsValid = validatePassword(value);

        if (!passwordIsValid) {
            errManager.addError(ERROR_PASSWORD, passwordRef);
        } else {
            errManager.removeError(ERROR_PASSWORD);
        }
    }


    // =================== Confirmation ===================
    const onValidationChangeHandler = (value) => {
        setValidation(value);
    }

    const onValidationBlurHandler = (value) => {
        const validationIsValid = (value === password);

        if (!validationIsValid) {
            errManager.addError(ERROR_VALIDATION_PASSWORD, validationRef);
        } else {
            errManager.removeError(ERROR_VALIDATION_PASSWORD);
        }
    }

    // =================== Submit ===================

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (errManager.hasErrors()) {
            errManager.focusOnError();
            return;
        }
        errManager.clearErrors();
        console.log(errManager.errors);
        try {
            console.log({
                email,
                password,
                validation
            })
            const response = await axios.post('http://localhost:3000/api/user/signup', {
                usermail: email,
                passWord: password
            })
            console.log(response.data);
            navigate("/mailValidation")
        }
        catch (e) {
            console.log(e);
            errManager.addError(e.response.data.message);
        }
    }

    let errorAlert;

    if (errManager.hasErrors()) {
        errorAlert = (
            <Alert>{ errManager.getFirstError() }</Alert>
        );
    }

    return (
        <Page>
            <Background paddingTop={1} title="inscription">
                <Form label="valider" onSubmit={onSubmitHandler}>
                    <Input
                        label="mail"
                        type="email"
                        ref={emailRef}
                        onChange={onEmailChangeHandler}
                        onBlur={onEmailBlurHandler}
                    />
                    <Input
                        label="mot de passe"
                        type="password"
                        ref={passwordRef}
                        onChange={onPasswordChangeHandler}
                        onBlur={onPasswordBlurHandler}
                    />
                    <Input
                        label="confirmation"
                        type="password"
                        ref={validationRef}
                        onChange={onValidationChangeHandler}
                        onBlur={onValidationBlurHandler}
                    />
                    {errorAlert}
                </Form>
            </Background>
        </Page>
    );
}

export default Signup;