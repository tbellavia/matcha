import styles from "./Test.module.css";
import Page from "../page/Page";
import InputTagList from "../../components/ui/tags/InputTagList";

function Test(){
    return (
        <Page className={styles.test}>
            <InputTagList/>
        </Page>
    );
}

export default Test;