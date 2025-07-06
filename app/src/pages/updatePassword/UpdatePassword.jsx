import React, { useRef, useState , useContext } from "react";
import Background from "../../components/ui/background/Background";
import GenericPage from "../page/GenericPage";
import Input from "../../components/ui/input/Input";
import Form from "../../components/ui/form/Form";
import Alert from "../../components/ui/alert/Alert";
import useErrorManager from "../../hooks/use-error-manager";
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useNavigate } from "react-router-dom";
import "../../styles/login.scss";
import {useParams} from "react-router-dom";
import { ERROR_PASSWORD } from "../../common/messages";
import { validatePassword } from "../../common/validation";


function UpdatePassword() {
    const passwordRef = useRef();
    const validationRef = useRef();
    
    const {id} = useParams();
    const [password, setPassword] = useState("");
    const errManager = useErrorManager();
    const ctx = useContext(AppContext);
    const navigate = useNavigate();

    const onPasswordHandler = (value) => {
        setPassword(value);
    }


    const onPasswordBlurHandler = (value) => {
        const passwordIsValid = validatePassword(value);

        if (passwordIsValid == false) {
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
                const response = await axios.post("http://localhost:3000/api/user/updatePassword/", {
                    idNewPassWord: id,
                    passWord: password,
                });
                if (response.data.isPwUpdate == true){
                    alert("Votre mot de passe a ete mis a jour");
                    navigate("/login");
                }
                else{
                    alert("Impossible de mettre a jour ce mot de passe");
                }
            } catch (e) {
                // errManager.addNetworkError(e.response.data.message); // TODO
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
            <Background paddingTop={2} title="NOUVEAU MDP">
                <Form className="login-form" onSubmit={onSubmitHandler} label="valider">
                    <Input
                        label="mot de passe"
                        type="password"
                        value={password}
                        onChange={onPasswordHandler}
                        onBlur={onPasswordBlurHandler}
                        ref={passwordRef}
                    />
                    {errorAlert}
                </Form>
                
            </Background>
        </GenericPage>
    );
}

export default UpdatePassword;