import {Alert, Button, Snackbar, Stack, TextField, Typography} from "@mui/material";
import Centered from "../../components/centered/Centered";
import {useForm} from "react-hook-form";
import { validatePassword, validateEmail } from "../../common/validation";

export default function Signup() {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = data => {
        console.log(data)
    }

    console.log(watch("email"));

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
                            required
                            {...register("email", { 
                                required: true, 
                                validate: validateEmail,
                            })}
                        />
                        <TextField
                            size="small"
                            label="mot de passe"
                            type="password"
                            required

                            {...register("password", { 
                                required: true, 
                                validate: validatePassword,
                                deps: ["confirmation"]
                            })}
                        />
                        <TextField
                            size="small"
                            label="confirmation du mot de passe"
                            type="password"
                            required

                            {...register("confirmation", { 
                                required: true, 
                                validate: (value) => {
                                    return value === watch('password') ? true : "le mot de passe de confirmation ne correspond pas au mot de passe"
                                },
                            })}
                        />
                        <Button type="submit" variant="contained">valider</Button>
                    </Stack>
                </form>
            </Stack>
        </Centered>
    )
}