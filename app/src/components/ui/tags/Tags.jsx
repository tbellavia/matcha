import styles from "./InputTagList.module.css";
import Tag from "./Tag";

function Tags({tags}) {
    if (!tags) {
        tags = [];
    }
    return (
        <div className={styles["input-tag-list"]}>
            <div className={styles["tag-label-container"]}>
            <div className={styles.labelDiv}>
                Tags
            </div>
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