import React, { useContext } from "react";
import AppContext from "../../../store/AppContext";
import BackgroundTitle from "./BackgroundTitle";

function BackgroundTitles({ n, children}) {
    let titles = [];

    for ( let i = 0 ; i < n ; ++i ) {
        const variant = ((i + 1) % 2 === 0) ? "light" : "dark";

        titles.push(
            <BackgroundTitle key={i} variant={variant}>{children}</BackgroundTitle>            
        );
    }

    return <React.Fragment>{titles}</React.Fragment>;
}

export default BackgroundTitles;