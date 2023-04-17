import React, { useState } from "react";
import BackgroundGradient from "../../components/ui/background/BackgroundGradient";
import GenericPage from "../page/GenericPage";
import MidLink from "../../components/ui/link/MidLink"

function Error404() {
    return (
        <GenericPage>
            <BackgroundGradient paddingTop={4} midPass={2} title="error 404">
                <MidLink lien='/' title="ici touves l'amour">nous n'avons pas trouvé la page que vous cherchez</MidLink>
            </BackgroundGradient>
        </GenericPage>
    );
}

export default Error404;