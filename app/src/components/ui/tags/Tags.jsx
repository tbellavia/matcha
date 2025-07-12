import styles from "./InputTagList.module.css";
import Tag from "./Tag";
import { useContext } from "react";
import AppContext from "../../../store/AppContext";

function Tags({ tags }) {
	if (!tags) {
		tags = [];
	}
	const { theme } = useContext(AppContext);
	const labelColor = styles[`labelDiv__${theme}`];
	return (
		<div className={styles["input-tag-list"]}>
			<div className={styles["tag-label-container"]}>
				<div className={`${labelColor} ${styles.labelDiv}`}>Tags</div>
			</div>
			<div className={styles["tags-container"]}>
				<ul className={styles["tags"]}>
					{tags.map((label, index) => (
						<Tag label={label} key={index} />
					))}
				</ul>
			</div>
		</div>
	);
}

export default Tags;
