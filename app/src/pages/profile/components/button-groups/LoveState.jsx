import React from "react";
import { QueryBuilder, Favorite, HeartBroken, Chat } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styles from "../../Profile.module.scss";

const iconColor = "var(--color-light-8)";

const loveIcons = [
	<QueryBuilder sx={{ color: iconColor, height: '35px', width: '35px' }} />,
	<Favorite sx={{ color: iconColor, height: '35px', width: '35px' }} />,
	<HeartBroken sx={{ color: iconColor, height: '35px', width: '35px' }} />,
];
const chatIcon = <Chat sx={{ color: iconColor, height: '35px', width: '35px' }} />;

function LoveState({ love, target }) {
    const navigate = useNavigate();
	function onClickChat() {
		navigate("/chat/" + target);
	}

	return (
		<React.Fragment>
			{(love[0] !== 0 || love[1] !== 0) && loveIcons[love[0]]}
			{(love[0] !== 0 || love[1] !== 0) && loveIcons[love[1]]}
			{love[0] === 1 && love[1] === 1 && target !== 0 && (
				<div className={styles.loveChatButton} onClick={onClickChat}>
					{chatIcon}
				</div>
			)}
		</React.Fragment>
	);
}

export default LoveState;