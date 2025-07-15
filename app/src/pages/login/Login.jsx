import { useRef, useState, useContext, useEffect } from "react";
import Background from "../../components/ui/background/Background";
import GenericPage from "../page/GenericPage";
import Input from "../../components/ui/input/Input";
import Form from "../../components/ui/form/Form";
import Alert from "../../components/ui/alert/Alert";
import { validateEmail } from "../../common/validation";
import { ERROR_MAIL, ERROR_PASSWORD } from "../../common/messages";
import useErrorManager from "../../hooks/use-error-manager";
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import "../../styles/login.scss";
import style from "./Login.module.css";
import { hasCreatedProfile, isValideToken } from "../../common/utils";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const errManager = useErrorManager();
    const emailRef = useRef();
    const passwordRef = useRef();
    const ctx = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (ctx.token && isValideToken(ctx.token)) {
            if (!hasCreatedProfile(ctx.token)){
                navigate("/profile/create")
            }
            else{
                navigate("/feed")
            }
        }
        // eslint-disable-next-line
      },[])

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

    const onClickHandlerBack = () => {
        navigate("/");
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
        if (errManager.hasInputErrors()) {
        }
        else {
            try {
                const response = await axios.post("http://localhost:3000/api/user/login", {
                    usermail: email,
                    passWord: password,
                });
                const token = response.data.access_token;

                ctx.setToken(response.data.access_token);
                if (hasCreatedProfile(token)) {
                    navigate("/feed");
                } else {
                    navigate("/profile/create");
                }
            } catch (e) {
                errManager.addNetworkError(e.response.data.message);
            }
        }
    }

    const sendOtp = async () => {
        try {
            if (email) {
                const response = await axios.post("http://localhost:3000/api/user/newPassword", {
                    usermail: email
                });

                if (response.data.isMailSent === true) {
                    alert("Un mail pour réinitialiser votre mot de passe vous a été envoyé.")
                } else {
                    alert("Une erreur bloque la réinitialisation de votre mot de passe")
                }
            } else {
                alert("Veuillez entrer votre email");
            }
        } catch (e) { }
    }

    let errorAlert;

    if (errManager.hasErrors()) {
        errorAlert = (
            <Alert>
                <p>{errManager.getFirstError()}</p>
            </Alert>
        )
    }

    return (
        <GenericPage>

            <Background paddingTop={2} title="connexion">
            <KeyboardDoubleArrowLeftIcon className={style.arrowLeft} onClick={onClickHandlerBack}/>
                <Form className="login-form" onSubmit={onSubmitHandler} label="valider">
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
                    <button type="button" onClick={() => sendOtp()} style={{color: 'blue', textDecoration: 'underline',
                        background: 'none', cursor: 'pointer', textAlign: 'left'}}>
                        Forgot Password ?
                    </button>
                    {errorAlert}
                </Form>

            </Background>
        </GenericPage>
    );
}

export default Login;