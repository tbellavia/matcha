import {Button, Stack, TextField, Typography} from "@mui/material";
import Centered from "../../components/centered/Centered";

export default function Signup() {
    return (<Centered>
        <Stack spacing={3}>
            <Typography variant="h1" fontSize={60}>
                Inscription
            </Typography>

            <TextField size="small" label="email" type="email" required/>
            <TextField size="small" label="mot de passe" type="password" required/>
            <TextField size="small" label="confirmation du mot de passe" type="password" id="password" required/>
            <Button type="submit" variant="contained">valider</Button>
        </Stack>
    </Centered>)
}