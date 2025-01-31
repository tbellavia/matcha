import { useState, useEffect } from "react";
import styles from "./InputTagList.module.css";
import Tag from "./Tag";
import Autocomplete from "./Autocomplete";
import Label from "../label/Label";
import useUniqueId from "../../../hooks/use-unique-id";
import useUpdateEffect from "../../../hooks/use-update-effect";
import { removeEmptyString } from "../../../common/utils";

function InputTagList({
    initial = [],
    suggest = [], 
    onChange = () => {},
    onBlur = () => {}
}) {
    const [suggestedTags, setSuggestedTags] = useState(suggest);
    const [tagList, setTagList] = useState(removeEmptyString(initial));
    const [suggestAlreadyUse, setAlreadyUse] = useState(removeEmptyString(initial));
    const [newTag, setNewTag] = useState("");
    const [tagsId] = useUniqueId("tags")

    useEffect(() => {
        if (initial && Array.isArray(initial)) {
            const cleanedInitial = removeEmptyString(initial);
            if (JSON.stringify(cleanedInitial) !== JSON.stringify(tagList)) {
                setTagList(cleanedInitial);
                setAlreadyUse(cleanedInitial);
            }
        }
    }, [initial]);


    useUpdateEffect(() => {
        console.log("tags init :",tagList)
        onChange(tagList);
        onBlur();
    }, [tagList])

    const valideValue = value => {
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
            setSuggestedTags([...suggestedTags, value])
        }
    }

    return (
        <div className={styles["input-tag-list"]}>
            <div className={styles["tag-label-container"]}>
                <Label htmlFor={tagsId} label="Tags"/>
            </div>
            <div className={styles["tags-container"]}>
                <ul className={styles["tags"]}>
                    {tagList.map(
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
                onBlur={onBlur}
                id={tagsId}
            />
        </div>
    );
}

export default InputTagList;