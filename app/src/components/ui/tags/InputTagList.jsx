import { useState } from "react";
import styles from "./InputTagList.module.css";
import Tag from "./Tag";
import Autocomplete from "./Autocomplete copy";

function InputTagList({tags, suggest}) {
    const [suggestedTags, setSuggestedTags] = useState(suggest);
    const [tagList, setTagList] = useState(tags);
    const [suggestAlreadyUse, setAlreadyUse] = useState([])
    const [newTag, setNewTag] = useState("");

    const valideValue = value => {
        console.log(value)
        if(tagList.indexOf(value) === -1){
            setTagList([...tagList,value])}   
        if(suggestedTags.indexOf(value) !== -1){
            setSuggestedTags(prevSuggestedTags => prevSuggestedTags.filter(tag => tag !== value));
            setAlreadyUse([...suggestAlreadyUse, value])}
        setNewTag("")
    }

    const onDeleteHandler = (value) => {
        setTagList(prevTagList => prevTagList.filter(tag => tag !== value));
        if(suggestAlreadyUse.indexOf(value) !== -1){
            setAlreadyUse(prevSuggestedTags => prevSuggestedTags.filter(tag => tag !== value));
            setSuggestedTags([...suggestedTags, value])}
    }

    return (
        <div className={styles["input-tag-list"]}>
            <div className={styles["tag-label-container"]}>
                <label htmlFor="">Tags</label>
            </div>
            <div className={styles["tags-container"]}>
                <ul className={styles["tags"]}>
                    {tagList.map(
                        (label, index) => 
                            <Tag 
                                label={label}
                                key={index}
                                onDelete={onDeleteHandler}
                                isInput={false}
                            />
                    )}
                </ul>
            </div>
            <Autocomplete suggest={suggestedTags} input={newTag} setInput={setNewTag} valideValue={valideValue}/>
        </div>
    );
}

export default InputTagList;