import {Typography} from "@mui/material";

export default function Blank({ name }) {
    return (
        <Typography component="h1" variant="h1">
            {name}
        </Typography>
    );
}