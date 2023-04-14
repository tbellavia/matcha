import styles from "./InputTagList.module.css";
import Tag from "./Tag";

function Tags({tags}) {

    return (
        <div className={styles["input-tag-list"]}>
            <div className={styles["tag-label-container"]}>
                <label htmlFor="">Tags</label>
            </div>
            <div className={styles["tags-container"]}>
                <ul className={styles["tags"]}>
                    {tags.map(
                        (label, index) => 
                            <Tag 
                                label={label}
                                key={index}
                            />
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Tags;