import styles from "./Test.module.css";
import GenericPage from "../page/GenericPage";
import AddPhoto from "../../components/ui/photo/AddPhoto";

function Test(){
    // const suggestedTags = ["beer", "ping-pong", "football", "baseball", "baise", "mainhi", "tony", "matcha"];
    // const [tags, setTags] = useState([]);

    // console.log("CHANGED");
    // const onChangeHandler = (newTags) => {
    //     console.log(newTags)
    //     setTags(newTags);
    // }

    const style = {
        display: "flex",
        justiyContent: "center",
        alignItems: "center",
    }
    
    const onPhotoChangeHandler = (photos) => {
        console.table(photos);
    }

    return (
        <GenericPage className={styles.test} style={style}>
            <AddPhoto onChange={onPhotoChangeHandler}/>
            {/* <InputTagList
                suggest={suggestedTags}
                value={tags}
                onChange={onChangeHandler}
            /> */}
        </GenericPage>
    );
}

export default Test;
