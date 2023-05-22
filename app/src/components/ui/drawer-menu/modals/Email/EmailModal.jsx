import {
    Dialog,
    Button,
    DialogTitle,
    DialogContentText,
    DialogContent,
    TextField,
    DialogActions
} from "@mui/material"

const EmailModal = ({ 
    open = false, 
    handleClose = () => {} 
}) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs">
            <DialogTitle>Reset email</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Veuillez renseigner votre adresse email, un mail de reset vous sera envoyé.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={handleClose}>Valider</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EmailModal