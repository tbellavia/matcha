import React, { useState } from "react";
import BackgroundGradient from "../../components/ui/background/BackgroundGradient";
import GenericPage from "../page/GenericPage";
import MidLink from "../../components/ui/link/MidLink"

function MailValidation() {
    return (
        <GenericPage>
            <BackgroundGradient paddingTop={4} midPass={2} title="valide">
                <MidLink lien='/login' title="connexion">Veuillez confirmer sur votre boite mail</MidLink>
            </BackgroundGradient>
        </GenericPage>
    );
}

export default MailValidation;