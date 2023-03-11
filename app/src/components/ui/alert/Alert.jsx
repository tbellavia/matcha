import styles from "./Alert.module.css";
import Card from "../card/Card";
import Icon from "../icons/Icon";
import AppContext from "../../../store/AppContext";
import { useContext } from "react";

function getAlertStyleBySeverity(severity, theme) {
    return styles[`alert-${severity}-${theme}`];
}

function getIconStyleBySeverity(severity, theme) {
    return styles[`alert-${severity}-${theme}__icon`]
}

function Alert({ severity = "error", children }) {
    const { theme } = useContext(AppContext)
    const alertStyle = `${styles.alert} ${getAlertStyleBySeverity(severity, theme)}`
    const iconStyle = getIconStyleBySeverity(severity, theme);

    return (
        <Card className={alertStyle}>
            <div className={styles['alert__icon-container']}>
                <Icon variant={severity} className={iconStyle}/>
            </div>
            <div className={styles['alert__message']}>{children}</div>
        </Card>
    );
}

export default Alert;