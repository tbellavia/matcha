import Centered from "../../components/centered/Centered";
import {Button, Link, Stack, TextField, Typography} from "@mui/material";

export default function Login() {
    return (
        <Centered>
            <Stack spacing={3}>
                <Typography variant="h1" fontSize={60}>
                    Connexion
                </Typography>

                <TextField size="small" label="email" type="email" id="email"/>
                <TextField size="small" label="mot de passe" type="password" id="password"/>

                <Stack spacing={1}>
                    <Button type="submit" variant="contained">valider</Button>

                    <Link sx={{textAlign: "right"}} underline="hover">
                        mot de passe oublié
                    </Link>
                </Stack>
            </Stack>
        </Centered>
    )
}