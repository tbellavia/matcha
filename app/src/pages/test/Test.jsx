import GenericPage from "../page/GenericPage";
import styles from "./Test.module.css";
import AppDropdown from "../../components/ui/drawer-menu/AppDropdown";

function Test() {
    const style = {
        display: "flex",
        justiyContent: "center",
        alignItems: "center",
        padding: "100px"
    }

    const notifs = {
        views: 1,
        messages: 2,
        likes: 3
    }

    return (
        <GenericPage className={styles.test} style={style}>
            <AppDropdown notifs={notifs}/>
        </GenericPage>
    );
}

export default Test;
