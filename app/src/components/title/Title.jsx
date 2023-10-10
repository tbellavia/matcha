import React from 'react';
import {Typography} from "@mui/material";

export default function Title() {
    return (
        <Typography
            variant="h1"
            sx={{
                color: "#EEE6E9",
                typography: {xs: "h2", md: "h1"}
            }}
        >
            MATCHA
        </Typography>
    );
}