import {Button, Stack, TextField, Typography} from "@mui/material";
import Centered from "../../components/centered/Centered";
import {useForm} from "react-hook-form";
import {formValidateConfirmationPassword, formValidateEmail, formValidatePassword} from "../../common/validation";
import {AutoHideAlert} from "../../components/auto-hide-alert/AutoHideAlert";
import {useMemo} from "react";
import APIAuth from "../../services/auth";
import {useNavigate} from "react-router-dom";


function getFirstError(errors) {
    let errorsKeys = Object.keys(errors);

    if (errorsKeys.length !== 0) {
        return errors[errorsKeys[0]].message;
    }
    return false;
}

export default function Signup() {
    const {
        register,
        watch,
        handleSubmit,
        formState: {errors},
    } = useForm();
    const api = useMemo(() => new APIAuth(), []);
    const error = getFirstError(errors);
    const navigate = useNavigate();

    const onSubmit = async data => {
        await api.signup(data.email, data.password);
        navigate("/");
    }

    return (
        <Centered>
            <Stack spacing={3}>
                <Typography variant="h1" fontSize={60}>
                    Inscription
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <TextField
                            size="small"
                            label="email"
                            type="email"

                            {...register("email", {
                                required: true,
                                validate: formValidateEmail,
                            })}
                        />
                        <TextField
                            size="small"
                            label="mot de passe"
                            type="password"

                            {...register("password", {
                                required: true,
                                validate: formValidatePassword
                            })}
                        />
                        <TextField
                            size="small"
                            label="confirmation du mot de passe"
                            type="password"

                            {...register("confirmation", {
                                required: true,
                                validate: (value) =>
                                    formValidateConfirmationPassword(watch("password"), value),
                                deps: ["password"]
                            })}
                        />
                        <Button type="submit" variant="contained">valider</Button>
                    </Stack>
                </form>
            </Stack>
            {error && <AutoHideAlert duration={5000} message={error}/>}
        </Centered>
    )
}