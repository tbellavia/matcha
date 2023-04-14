import styles from "./Test.module.css";
import Page from "../page/Page";
import InputTagList from "../../components/ui/tags/InputTagList";
import Autocomplete from "../../components/ui/tags/Autocomplete copy"
import { useState } from "react";
import Autocomplete2 from "../../components/ui/tags/Autocomplete";
import Tags from "../../components/ui/tags/Tags";

function Test(){
    const [test, setTest] = useState(['test','test1','test2','a','z','e','p3','test3','test13','test23','a3','z3','e3','p']);
    const [suggest, setSugges] = useState(["one", "two", "three"]);
    
    const [input, setInput] = useState("");
    // const valideValue = (val) =>{
    //     console.log("valideValue")
    //     setInput(val)
    //     console.log("valideValue2")

    // }

    return (
        <Page className={styles.test}>
            {/* <InputTagList tags={test} suggest={suggest}/> */}
            {/* <Autocomplete suggest={test} input={input} setInput={setInput} valideValue={valideValue}/> */}
            {/* <Autocomplete2 suggestions={test}/> */}
            <Tags tags={test}/>
        </Page>
    );
}

export default Test;