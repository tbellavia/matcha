import {Container} from "@mui/material";

export default function Centered(props) {
    return (
        <Container sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
        }}>
            {props.children}
        </Container>
    )
}