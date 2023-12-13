import Centered from "../../components/centered/Centered";
import {Button, Link, Stack, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import {getFirstError} from "../../utils/utils";
import {useNavigate} from "react-router-dom";
import {formValidateEmail} from "../../common/validation";
import {AutoHideAlert} from "../../components/auto-hide-alert/AutoHideAlert";
import {useQuery} from "react-query";
import {useMemo} from "react";
import APIAuth from "../../services/auth";

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors},
        getValues,
    } = useForm();
    const error = getFirstError(errors);
    const navigate = useNavigate();
    const api = useMemo(() => new APIAuth(), []);

    const { refetch } = useQuery({
        queryFn: async () => {
            const mail = getValues("email");
            const password = getValues("password");

            await api.login(mail, password);
        },
        onSuccess() {
            if (api.hasCreatedProfile()) {
                navigate("/feed");
            } else {
                navigate("/profile/create");
            }
        },
        enabled: false,
    });

    const onSubmit = async () => { await refetch() }

    const registerEmail = register("email", {
       required: true,
       validate: formValidateEmail,
    });

    const registerPassword = register("password", {required: true});

    return (
        <Centered>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                    <Typography variant="h1" fontSize={60}>
                        Connexion
                    </Typography>

                    <TextField size="small" label="email" type="email" required {...registerEmail}/>
                    <TextField size="small" label="mot de passe" type="password" required {...registerPassword}/>

                    <Stack spacing={1}>
                        <Button type="submit" variant="contained">valider</Button>

                        <Link sx={{textAlign: "right"}} underline="hover">
                            mot de passe oublié
                        </Link>
                    </Stack>
                </Stack>
            </form>
            {error && <AutoHideAlert duration={5000} message={error}/>}
        </Centered>
    )
}