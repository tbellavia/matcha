import styles from "./Test.module.css";
import Page from "../page/Page";
import RadioButtonGroup from "../../components/ui/radio-button/RadioButtonGroup";

function Test() {
    const onChangeHandler = (event) => {
        console.log(event.target.value);
    }

    return (
        <Page className={styles.test}>
            <RadioButtonGroup></RadioButtonGroup>
        </Page>
    );
}

export default Test;