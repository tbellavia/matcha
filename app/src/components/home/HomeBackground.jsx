import { useContext } from "react";
import style from "./HomeBackground.module.css";
import AppContext from "../../store/AppContext";

function HomeBackground({children, className}) {
    const ctx = useContext(AppContext);
    const titles = Array.from(Array(6).keys());
    const overlayClasses = `${style.overlay} ${className}`;

    return (
        <div className={style.background}>
            <div className={overlayClasses}>
                {children}
            </div>
            <div className={style.inner}>
                {titles.map((key) => {
                    const color = `var(--color-${ctx.theme}-red-shade-${key + 1})`;

                    return (
                        <h2 className={style.title}
                            style={{color: color}}
                            key={key}>
                            MATCHA
                        </h2>
                    );
                })}
            </div>
        </div>
    );
}

export default HomeBackground;