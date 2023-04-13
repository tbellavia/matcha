import styles from "./Test.module.css";
import Page from "../page/Page";
import RadioButtonGroup from "../../components/ui/radio-button/RadioButtonGroup";
import { useState } from "react";

function Test() {
    const [choice, setChoice] = useState("LGBT");

    const onChangeHandler = (value) => {
        console.log(`Value: ${value}`);
        setChoice(value);
    }

    return (
        <Page className={styles.test}>
            <RadioButtonGroup 
                label="Genre"
                initial={choice}
                values={["HOMME", "FEMME", "LGBT"]}
                onChange={onChangeHandler}
            />
        </Page>
    );
}

export default Test;