import styles from "./Test.module.css";
import Page from "../page/Page";
import Autocomplete from "../../components/ui/tags/Autocomplete"
import { useState } from "react";

function Test(){
    const autocompleteList = ['test','test1','test2','a','z','e','p3','test3','test13','test23','a3','z3','e3','p'];
    const [choice, setChoice] = useState("");

    const onSubmitHandler = (val) =>{
        console.log(`Submit: ${val}`);
        setChoice(val)
    }

    return (
        <Page className={styles.test} style={{
            display: "flex",
            justiyContent: "center",
            alignItems: "center",
        }}>
            <div style={{
                width: "45vw",
                marginTop: "150px"
            }}>
                <h1>Google</h1>
                <Autocomplete 
                    suggest={autocompleteList} 
                    value={choice} 
                    onChange={setChoice} 
                    onSubmit={onSubmitHandler}
                />
            </div>
        </Page>
    );
}

export default Test;


// import styles from "./Test.module.css";
// import Page from "../page/Page";
// import { useState } from "react";
// import CheckboxGroup from "../../components/ui/checkbox/CheckboxGroup";
// import Header from "../../components/ui/header/Header";

// function Test(){
//     const [checked, setChecked] = useState({});

//     const onChangeHandler = (values) => {
//         console.log(values);
//         setChecked(values);
//     }

//     return (
//         <Page className={styles.test}>
//             <Header/>
//             <CheckboxGroup 
//                 label="Genre" 
//                 values={["Homme", "Femme"]}
//                 onChange={onChangeHandler}
//             />
//         </Page>
//     );
// }

// export default Test;