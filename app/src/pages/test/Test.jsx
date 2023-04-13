import styles from "./Test.module.css";
import Page from "../page/Page";
import CheckboxGroup from "../../components/ui/checkbox/CheckboxGroup";
import RadioButtonGroup from "../../components/ui/radio-button/RadioButtonGroup";

function Test() {
    const onChangeHandler = (val) => {
        console.log(val);
    }

    return (
        <Page className={styles.test}>
            <CheckboxGroup label="Names" values={["tony", "mai-nhi"]} onChange={onChangeHandler}/>
            <RadioButtonGroup label="Names" values={["tony", "mai-nhi"]} onChange={onChangeHandler}/>
        </Page>
    );
}

export default Test;