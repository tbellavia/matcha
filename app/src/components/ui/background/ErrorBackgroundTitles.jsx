import React from "react";
import BackgroundTitle from "./ErrorBackgroundTitle";

function ErrorBackgroundTitles({n, children}) {
    let titles = [];

    for ( let i = 0 ; i < Math.abs(n) ; ++i ) {
        let variant = 1
        if (n > 0 && (n - i) < 4){
            variant = Math.abs(n - i - 5)
        }
        else if (n < 0 && i < 3){
            variant = Math.abs(i - 4)
        }

        titles.push(
            <BackgroundTitle key={i} variant={variant}>{children}</BackgroundTitle>            
        );
    }

    return <React.Fragment>{titles}</React.Fragment>;
}

export default ErrorBackgroundTitles;