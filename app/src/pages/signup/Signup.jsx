import {Button, Stack, TextField, Typography} from "@mui/material";
import Centered from "../../components/centered/Centered";
import {useForm} from "react-hook-form";

export default function Signup() {
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <Centered>
            <Stack spacing={3}>
                <Typography variant="h1" fontSize={60}>
                    Inscription
                </Typography>
                <form>
                    <Stack spacing={3}>
                        <TextField
                            size="small"
                            label="email"
                            type="email"
                            required
                            ref={register("email")}
                        />
                        <TextField
                            size="small"
                            label="mot de passe"
                            type="password"
                            required
                        />
                        <TextField
                            size="small"
                            label="confirmation du mot de passe"
                            type="password"
                            id="password"
                            required
                        />
                        <Button type="submit" variant="contained">valider</Button>
                    </Stack>
                </form>
            </Stack>
        </Centered>
    )
}