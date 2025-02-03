import Button from "../../../../components/ui/button/Button";
import styles from "../../Profile.module.scss";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import React, { useContext } from "react";
import AppContext from "../../../../store/AppContext";

function ButtonGroupMe() {
    const navigate = useNavigate()
    const ctx = useContext(AppContext);
    
    const onModifClicked = () => {
        // TODO: Manage error

        navigate("/profile/edit");

    }


    const onDelProfilClicked = async() => {
        await axios.delete(`http://localhost:3000/api/user/me`,{
            headers: {
                Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
              },
            data: {
            }
          });
        ctx.logout()
    }

    return (
        <React.Fragment>
            <Button
                type="submit"
                variant="regular"
                className={styles["button"]}
                onClick={onModifClicked}>
                
                modifier
            </Button>
            <Button
                type="submit"
                variant="action-danger"
                className={styles["button"]}
                onClick={onDelProfilClicked}>
                supprimer
            </Button>
        </React.Fragment>
    )
}

export default ButtonGroupMe;