import React, { useState } from "react";
import ErrorBackground from "../../components/ui/background/ErrorBackground";
import Page from "../page/Page";

function Error404() {
    return (
        <Page>
            <ErrorBackground paddingTop={5} title="nous n'avons pas trouvé la page que vous cherhcez" title2="ici touves l'amour">
            </ErrorBackground>
        </Page>
    );
}

export default Error404;