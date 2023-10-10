import {Box, Button, Container, Typography} from "@mui/material";

export default function Home() {
    return (
        <Container sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
        }}>
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
        </Container>
    )
}