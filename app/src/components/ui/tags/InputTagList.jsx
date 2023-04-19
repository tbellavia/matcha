import { useState } from "react";
import styles from "./InputTagList.module.css";
import Tag from "./Tag";
import Autocomplete from "./Autocomplete";
import Label from "../label/Label";
import useUniqueId from "../../../hooks/use-unique-id";

function InputTagList({
    value,
    suggest, 
    onChange = () => {},
}) {
    const [suggestedTags, setSuggestedTags] = useState(suggest);
    const [suggestAlreadyUse, setAlreadyUse] = useState([])
    const [newTag, setNewTag] = useState("");
    const [tagsId] = useUniqueId("tags")

    const valideValue = val => {

        if (value.indexOf(val) === -1) {
            onChange([...value, val])
        }
        if (suggestedTags.indexOf(val) !== -1) {
            setSuggestedTags(prevSuggestedTags => prevSuggestedTags.filter(tag => tag !== val));
            setAlreadyUse([...suggestAlreadyUse, val])
        }
        setNewTag("")
    }

    const onDeleteHandler = (val) => {
        onChange(prevTagList => prevTagList.filter(tag => tag !== val));
        if (suggestAlreadyUse.indexOf(val) !== -1) {
            setAlreadyUse(prevSuggestedTags => prevSuggestedTags.filter(tag => tag !== val));
            setSuggestedTags([...suggestedTags, val])
        }
    }

    return (
        <div className={styles["input-tag-list"]}>
            <div className={styles["tag-label-container"]}>
                <Label htmlFor={tagsId} label="Tags"/>
            </div>
            <div className={styles["tags-container"]}>
                <ul className={styles["tags"]}>
                    {value.map(
                        (label, index) =>
                            <Tag
                                label={label}
                                key={index}
                                onDelete={onDeleteHandler}
                                isInput={true}
                            />
                    )}
                </ul>
            </div>
            <Autocomplete
                suggest={suggestedTags}
                value={newTag}
                onChange={setNewTag}
                onSubmit={valideValue}
                placeholder="Tags..."
                id={tagsId}
            />
        </div>
    );
}

export default InputTagList;