import styles from "./Test.module.css";
import Page from "../page/Page";
import Checkbox from "../../components/ui/checkbox/Chekbox";

function Test(){
    return (
        <Page className={styles.test}>
            <Checkbox/>
        </Page>
    );
}

export default Test;