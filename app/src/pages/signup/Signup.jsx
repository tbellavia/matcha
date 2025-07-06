import GenericPage from "../page/GenericPage";
import Background from "../../components/ui/background/Background";
import Form from "../../components/ui/form/Form";
import Input from "../../components/ui/input/Input";
import { useContext, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import useErrorManager from "../../hooks/use-error-manager";
import { validateEmail, validatePassword } from "../../common/validation";
import { ERROR_MAIL, ERROR_PASSWORD, ERROR_USER_ALREADY_EXIST, ERROR_VALIDATION_PASSWORD } from "../../common/messages";
import Alert from "../../components/ui/alert/Alert";
import axios from "axios";
import '../../styles/login.scss';
import { hasCreatedProfile, isValideToken } from "../../common/utils";
import AppContext from "../../store/AppContext";
import style from "./Signup.module.css";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const validationRef = useRef();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState("");
    const errManager = useErrorManager();
    const ctx = useContext(AppContext);


    useEffect(() => {
        if (ctx.token && isValideToken(ctx.token)) {
            if (!hasCreatedProfile(ctx.token)){
                navigate("/profile/create")
            }
            else{
                navigate("/feed")
            }
        }
      }, [])

    const onClickHandlerBack = () => {
        navigate("/");
    }

    // =================== Email ===================
    const onEmailChangeHandler = (value) => {
        errManager.removeError(ERROR_USER_ALREADY_EXIST);

        setEmail(value);
    }

    const onEmailBlurHandler = (value) => {
        const emailIsValid = validateEmail(value);

        if (!emailIsValid) {
            errManager.addInputError(ERROR_MAIL, emailRef);
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
            errManager.addInputError(ERROR_PASSWORD, passwordRef);
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
            errManager.addInputError(ERROR_VALIDATION_PASSWORD, validationRef);
        } else {
            errManager.removeError(ERROR_VALIDATION_PASSWORD);
        }
    }

    // =================== Submit ===================

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (errManager.hasInputErrors()) {
            errManager.focusOnError();

        } else {
            try {
                await axios.post('http://localhost:3000/api/user/signup', {
                    usermail: email,
                    passWord: password
                })
                navigate("/mailValidation")
            }
            catch (e) {
                if(e.response.data.message === ERROR_USER_ALREADY_EXIST){
                    errManager.addInputError(ERROR_USER_ALREADY_EXIST, emailRef);
                }else{
                    errManager.removeError(ERROR_USER_ALREADY_EXIST);
                }
            }
        }
    }

    let errorAlert;

    if (errManager.hasErrors()) {
        errorAlert = (
            <Alert>{ errManager.getFirstError() }</Alert>
        );
    }

    return (
        <GenericPage>
            <Background paddingTop={1} title="inscription">
            <KeyboardDoubleArrowLeftIcon className={style.arrowLeft} onClick={onClickHandlerBack}/>
                <Form className="login-form" label="valider" onSubmit={onSubmitHandler}>
                    <Input
                        label="mail"
                        type="email"
                        ref={emailRef}
                        value={email}
                        onChange={onEmailChangeHandler}
                        onBlur={onEmailBlurHandler}
                    />
                    <Input
                        label="mot de passe"
                        type="password"
                        value={password}
                        ref={passwordRef}
                        onChange={onPasswordChangeHandler}
                        onBlur={onPasswordBlurHandler}
                    />
                    <Input
                        label="confirmation"
                        type="password"
                        value={validation}
                        ref={validationRef}
                        onChange={onValidationChangeHandler}
                        onBlur={onValidationBlurHandler}
                    />
                    {errorAlert}
                </Form>
            </Background>
        </GenericPage>
    );
}

export default Signup;