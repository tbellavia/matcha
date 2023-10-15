import {Box, Button} from "@mui/material";
import Centered from "../../components/centered/Centered";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    function onConnexionClickedHandler() {
        navigate("/login")
    }

    function onSignupClickedHandler() {
        navigate("/signup")
    }

    return (
        <Centered>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "300px",
            }}>
                <Button variant="contained" size="large" onClick={onConnexionClickedHandler}>
                    Connexion
                </Button>
                <Button variant="contained" size="large" onClick={onSignupClickedHandler}>
                    Inscription
                </Button>
            </Box>
        </Centered>
    )
}