import { useState } from "react";
import styles from "./InputTagList.module.css";
import Tag from "./Tag";

function InputTagList({ tags = [], suggested = [] }) {
    const [suggestedTags, setSuggestedTags] = useState(["one", "two", "three"]);
    const [tagList, setTagList] = useState(["foot", "beer", "baseball"]);
    const [newTag, setNewTag] = useState("");


    const onDeleteHandler = (value) => {
        setTagList(prevTagList => prevTagList.filter(tag => tag !== value));
    }

    const onNewTagChangeHandler = (event) => {
        setNewTag(event.target.value);
    }

    const onNewTagKeydownHandler = (event) => {
        if (event.key === "Enter"){
            setTagList(prevTagList => [...prevTagList, newTag]);
            setSuggestedTags(prevSuggestedTags => prevSuggestedTags.filter(tag => tag !== newTag));
            setNewTag("");
        }
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
                            />
                    )}
                </ul>
                <input
                    type="text" 
                    list="taglist"
                    onChange={onNewTagChangeHandler}
                    value={newTag}
                    onKeyDown={onNewTagKeydownHandler}
                />
                <datalist id="taglist">
                    {suggestedTags.map(
                        (label, index) => <option value={label} key={index}>{label}</option>
                    )}
                </datalist>
            </div>
        </div>
    );
}

export default InputTagList;