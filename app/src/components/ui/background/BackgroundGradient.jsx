import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import styles from "./BackgroundGradient.module.css";
import BackgroundTitle from "./BackgroundTitle";
import React from "react";

function BackgroundGradient({ paddingTop, title, midPass, children }) {
    const ctx = useContext(AppContext);
    const titleCol = styles[`title__color__${ctx.theme}`];
    let titles = [];

    for ( let i = 0 ; i < paddingTop ; ++i ) {
        let variant = 1
        if ((paddingTop - i) < 4){
            variant = Math.abs(paddingTop - i - 5)
        }
        titles.push(
            <BackgroundTitle key={i} variant={variant}>{title}</BackgroundTitle>            
        );
    }

    for ( let i = 0 ; i < midPass ; ++i ) {
        let variant = 4
        titles.push(
            <BackgroundTitle key={i + paddingTop} variant={variant}>{title}</BackgroundTitle>            
        );
    }

    for ( let i = 0 ; i < 20 ; ++i ) {
        let variant = 1
        if (i < 3){
            variant = Math.abs(i - 4)
        }
        titles.push(
            <BackgroundTitle key={i + paddingTop + midPass} variant={variant}>{title}</BackgroundTitle>            
        );
    }

    return (
        <div className={styles.background}>
            <div className={styles.overlay}>
                {children}
            </div>
            <div className={styles.inner}>
                <React.Fragment>{titles}</React.Fragment>
            </div>
        </div>
    );
}

export default BackgroundGradient;
