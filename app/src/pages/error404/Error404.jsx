import React, { useState } from "react";
import BackgroundGradient from "../../components/ui/background/BackgroundGradient";
import Page from "../page/Page";
import MidLink from "../../components/ui/link/MidLink"

function Error404() {
    return (
        <Page>
            <BackgroundGradient paddingTop={4} midPass={2} title="error 404">
                <MidLink lien='/' title="ici touves l'amour">nous n'avons pas trouvé la page que vous cherchez</MidLink>
            </BackgroundGradient>
        </Page>
    );
}

export default Error404;