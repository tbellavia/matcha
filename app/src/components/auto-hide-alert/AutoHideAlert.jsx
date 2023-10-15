import {useState} from "react";
import {Alert, Snackbar} from "@mui/material";

export function AutoHideAlert({ message, duration }) {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
        >
            <Alert severity="error">
                {message}
            </Alert>
        </Snackbar>
    )
}