import styles from "./Test.module.css";
import Page from "../page/Page";
import Alert from "../../components/ui/alert/Alert";

function Test(){
    return (
        <Page className={styles.test}>
            <Alert severity="error">error</Alert>
            <Alert severity="warning">warning</Alert>
            <Alert severity="info">info</Alert>
            <Alert severity="notification">notification</Alert>
        </Page>
    );
}

export default Test;