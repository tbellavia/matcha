import React, { useState, useContext } from "react";
import axios from "axios";
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContentText,
    DialogContent,
    TextField,
    DialogActions
} from "@mui/material"
import AppContext from "../../../../../store/AppContext";
// import { useNavigate } from "react-router-dom";

const EmailModal = ({ 

    open = false, 
    handleClose = () => {}, 
    onSubmitHandler = async (email,ctx) => {
        const config = {
            headers: {
              Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
            
        },
        
          };
        const response = await axios.post("http://localhost:3000/api/user/defNewMail", {newMail: email},config);
        // const response = await axios.post("http://localhost:3000/api/user/defNewMail", {
        //     newMail: email,
        // });
        if (response.data.isMailSent == true){
            alert("Un mail vous a etes envoyer a cette nouvelle adresse");
            handleClose();
        }
        else{
            alert("Imposible de mettre a jour votre mail");
        }
    } 
}) => {
    const [email, setEmail] = useState("");
    const ctx = useContext(AppContext);
    const handleSubmit = () => {
        if (!email) {
            alert("Veuillez renseigner une adresse email.");
            return;
        }
        onSubmitHandler(email, ctx);
    };


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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={handleSubmit}>Valider</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EmailModal