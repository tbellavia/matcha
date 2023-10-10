import {Box, Button, Container} from "@mui/material";
import Centered from "../../components/centered/Centered";

export default function Home() {
    return (
        <Centered>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "300px",
            }}>
                <Button variant="contained" size="large">
                    Connexion
                </Button>
                <Button variant="contained" size="large">
                    Inscription
                </Button>
            </Box>
        </Centered>
    )
}