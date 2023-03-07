import { useContext } from "react";
import style from "./Button.module.css";
import AppContext from "../../../store/AppContext";

function getVariantStyle(theme, variant) {
    return style[`button__${theme}__${variant}`];
}

function Button({ onClick, type, variant, className, children }){
    const ctx = useContext(AppContext);
    const classes = `${style.button} ${getVariantStyle(ctx.theme, variant)} round ${className}`;

    if (!onClick) {
        onClick = () => {};
    }

    return (
        <button 
            className={classes}
            type={type}
            onClick={onClick}
        >
            {children.toUpperCase()}
        </button>
    );
}

export default Button;