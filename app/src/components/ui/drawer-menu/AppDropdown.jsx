import { AccountCircle, Chat, Favorite, History, Logout, RemoveRedEye, Settings, Tune } from "@mui/icons-material";
import Dropdown from "./Dropdown";
import { Box, keyframes } from "@mui/material";
import { useContext, useState } from "react";
import SettingsModal from "./modals/Settings/SettingsModal";
import AppContext from "../../../store/AppContext";

// TODO: Manage notifications in context
/**
 * AppDroddown
 * 
 * AppDropdown represent the upper menu and manage the notification display.
 * 
 * @param {Object}  notifs Object containing at most 'views' 'likes' and 'messages' keys, the value is
 * the number of notifications, example : { views: 1, likes: 1, messages: 1 }
 * All keys has one notification, if one key has 0 notification, no notification badge will be shown.
 * 
 * @returns 
 */
export default function AppDroddown({
    notifs = {}
}) {
    const ctx = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const onSettingsClickHandler = () => {
        setOpen(true);
    }

    // Check if there are notifications
    const notify = ["likes", "messages", "views"].some(k => notifs[k] && notifs[k] !== 0)

    const appDropddownItems = [
        {
            "Profiles": {
                onClick: () => { },
                icon: <AccountCircle sx={{ color: iconColor }} />,
                notifs: 0
            },
            "Vues": {
                onClick: () => { },
                icon: <RemoveRedEye sx={{ color: iconColor }} />,
                notifs: notifs.views
            },
            "Likes": {
                onClick: () => { },
                icon: <Favorite sx={{ color: iconColor }} />,
                notifs: notifs.likes
            },
            "Messages": {
                onClick: () => { console.log("Message") },
                icon: <Chat sx={{ color: iconColor }} />,
                notifs: notifs.messages
            },
            "Historique": {
                onClick: () => { },
                icon: <History sx={{ color: iconColor }} />,
                notifs: 0
            },
            "Filtres": {
                onClick: () => { },
                icon: <Tune sx={{ color: iconColor }} />,
                notifs: 0
            }
        },
        {
            "Paramètres": {
                onClick: onSettingsClickHandler,
                icon: <Settings sx={{ color: iconColor }} />,
                notifs: 0
            },
            "Déconnexion": {
                onClick: () => { 
                    ctx.logout()
                },
                icon: <Logout sx={{ color: iconColor }} />,
                notifs: 0
            }
        }
    ]

    const notifyBadgeSize = 17;
    const iconContainerBg = {
        light: "var(--color-light-4)",
        dark: "var(--color-dark-10)",
        blind: "var(--color-light-4)"
    }

    return (
        <Box sx={{
            width: 60,
            height: 60,
            bgcolor: iconContainerBg[ctx.theme],
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
            position: "relative"
        }}>
            {/* Notify Badge */}
            <Box
                sx={{
                    width: notifyBadgeSize,
                    height: notifyBadgeSize,
                    borderRadius: "100%",
                    bgcolor: "#23C552",
                    zIndex: "2",
                    position: "absolute",
                    top: 11,
                    right: 10,
                    textAlign: "center",
                    color: "white",
                    display: notify ? "" : "none",
                    animation: `${bounce} 3s ease-in-out`,
                    animationDelay: "1s",
                    animationIterationCount: "infinite",
                }}
            />
            <Dropdown items={appDropddownItems} />

            {/* Menu Modals */}
            <SettingsModal open={open} handleClose={handleClose} />
        </Box>
    )
}

// Styles

const iconColor = "var(--color-light-8)";

const bounce = keyframes`
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 
        40% { transform: translateY(-2px); } 
        60% { transform: translateY(-5px); } 
`;