import { Box, Button } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import AppContext from "../../../store/AppContext";
import { Logout } from "@mui/icons-material";
import styles from "./Header.module.css";

const DisconnectButton = () => {
	const ctx = useContext(AppContext);

	const disconnectOnClick = async () => {
		const config = {
			headers: {
				Authorization: `Bearer ${ctx.token}`,
			},
		};
		try {
			await axios.put(
				`http://localhost:3000/api/user/connexion/me/off`,
				{},
				config
			);
			ctx.logout();
		} catch (e) {}
	};

	return (
		<React.Fragment>
			<Box
				className={styles["button-disconnect"]}
				sx={{
					bgcolor: iconContainerBg[ctx.theme],
					display: "flex",
					justifyContent: "center",
					borderRadius: "100%",
				}}
			>
				<Button
					type="submit"
					variant="action-danger"
					onClick={disconnectOnClick}
				>
					<Logout sx={{ color: iconColor }} />
				</Button>
			</Box>
		</React.Fragment>
	);
};

const iconColor = "var(--color-light-8)";

const iconContainerBg = {
	light: "var(--color-light-4)",
	dark: "var(--color-dark-10)",
	blind: "var(--color-light-4)",
};

export default DisconnectButton;
