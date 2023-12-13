import Centered from "../../components/centered/Centered";
import EmailIcon from '@mui/icons-material/Email';
import {Box, Button, Divider, Paper, Stack, Typography} from "@mui/material";
import styles from "./Validation.module.css";
import {useNavigate} from "react-router-dom";

export default function Validation() {
    const navigate = useNavigate();

    const onConnexionClicked = () => {
        navigate("/login");
    }

    return (
        <Centered>
            <Paper elevation={3} className={styles.paper} variant="outlined">
                <Stack spacing={2} sx={{ display: "flex", alignItems: "center" }}>
                    <Box className={styles.box}>
                        <EmailIcon color="primary"/>
                    </Box>
                    <Typography component="h6" variant="h6">
                        Veuillez vérifier vos email
                    </Typography>

                    <Divider variant="middle" sx={{ width: "100%" }}/>

                    <Typography>
                        Afin d'utiliser Matcha, vous devez valider votre compte.
                    </Typography>

                    <Button variant="contained" fullWidth onClick={onConnexionClicked}>
                        Connexion
                    </Button>
                </Stack>
            </Paper>
        </Centered>
    )
}