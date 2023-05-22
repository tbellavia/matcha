import {
    Dialog,
    Button,
    DialogTitle,
    DialogContentText,
    DialogContent,
    TextField,
    DialogActions
} from "@mui/material"

const PasswordModal = ({
    open,
    handleClose
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
                    id="password"
                    label="Mot de passe actuel"
                    type="password"
                    fullWidth
                    variant="standard"
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="reset-password"
                    label="Nouveau mot de passe"
                    type="password"
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

export default PasswordModal