import { AccountCircle, Chat, Favorite, History, Logout, RemoveRedEye, Settings, Tune } from "@mui/icons-material";
import Dropdown from "./Dropdown";
import { Box, keyframes } from "@mui/material";
import { useContext, useState , useEffect, useMemo} from "react";
import SettingsModal from "./modals/Settings/SettingsModal";
import AppContext from "../../../store/AppContext";
import socket from "../../../socket";
import soundFile from '../../../assets/son/son1.mp3';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AppDroddown() {
    const ctx = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [idProfile, setIdProfile] = useState(false);
    const [sizeViews, setSizeViews] = useState(0)
    const [sizeLikes, setSizeLikes] = useState(0)
    const [sizeMessages, setSizeMessages] = useState(0)
    const navigate = useNavigate()
 
    // const [test, setTest] = useState(0)
    const onSettingsClickHandler = () => {
        setOpen(true);
    }

    // Check if there are notifications
    const [notify, setNotify] = useState(sizeViews + sizeLikes + sizeMessages)

    useEffect(()=>{
        setNotify(sizeViews + sizeLikes + sizeMessages)
    }, [sizeViews, sizeLikes, sizeMessages])
    
    // console.log(notify)
    // const notify = 

    const getIdProfile = async() => {
        const config = {
            headers: {
              Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
            },
          };
        const res = await axios.get('http://localhost:3000/api/user/profile/getId/me',config)
        const notifRes = await axios.get('http://localhost:3000/api/user/notifs',config)
        // console.log(notifRes.data.likes)
        ctx.setNotifs(notifRes.data)
        // console.log(notifRes.data.views)
        setSizeViews(Object.entries(notifRes.data.views).filter(([key, value]) => value === true).length)
        setSizeLikes(Object.entries(notifRes.data.likes).filter(([key, value]) => value === true).length)
        setSizeMessages(Object.entries(notifRes.data.messages).filter(([key, value]) => value > 0).length)
        setIdProfile(res.data.id)

    }

    useEffect(()=>{
        getIdProfile()
    }, [])

    useEffect(() => {

        function viewEnter({from}){
            const audio = new Audio(soundFile);
            audio.play();
            // ctx.notifs['views'] = (ctx.notifs['views']?ctx.notifs['views']+1:1) 
            console.log(ctx.notifs.views)
            console.log(`views ${from}`)
            ctx.setNotifs({"views":{...ctx.notifs.views, from : true},"messages":{...ctx.notifs.messages},"likes":{...ctx.notifs.likes}})
            setSizeViews(prev => prev + 1)
        }

        function likeEnter({from}){
            const audio = new Audio(soundFile);
            audio.play();
            // ctx.notifs['likes'] = (ctx.notifs['likes']?ctx.notifs['likes']+1:1) 
            console.log(ctx.notifs.likes)
            console.log(`likes ${from}`)
            ctx.setNotifs({"likes":{...ctx.notifs.likes, from : true},"messages":{...ctx.notifs.messages},"views":{...ctx.notifs.views}})
            setSizeLikes(prev => prev + 1)
        }

        function messagesEnter({from}){
            const audio = new Audio(soundFile);
            audio.play();
            // ctx.notifs['likes'] = (ctx.notifs['likes']?ctx.notifs['likes']+1:1) 
            console.log(ctx.notifs.likes)
            console.log(`message ${from}`)
            ctx.setNotifs({"likes":{...ctx.notifs.likes},"messages":{...ctx.notifs.messages, from : (ctx.notifs.messages[from]?ctx.notifs['messages'][from]+1:1) },"views":{...ctx.notifs.views}})
            setSizeMessages(prev => prev + 1)
        }
            // ctx.setNotifs({"likes":{...ctx.notifs.likes},"messages":{...ctx.notifs.messages, from : (ctx.notifs.messages[from]?ctx.notifs.messages[from]+1:1)},"likes":{...ctx.notifs.likes}})
        socket.connect()

        socket.on(`view${idProfile}`, viewEnter)
        socket.on(`like${idProfile}`,likeEnter)
        socket.on(`messages${idProfile}`, messagesEnter)
        socket.on(`match${idProfile}`,messagesEnter)

        return () => {
          socket.off(`likes${idProfile}`)
          socket.off(`view${idProfile}`)
          socket.off(`messages${idProfile}`)
          socket.off(`match${idProfile}`)
          socket.disconnect();
        }
      },[idProfile]) 
    
    const appDropddownItems = useMemo(()=>[
        {
            "Profiles": {
                onClick: () => {navigate(`/feed`)},
                icon: <AccountCircle sx={{ color: iconColor }} />,
                notifs: 0
            },
            "Vues": {
                onClick: () => {navigate(`/feedViews`)},
                icon: <RemoveRedEye sx={{ color: iconColor }} />,
                notifs: sizeViews
            },
            "Likes": {
                onClick: () => { navigate(`/feedLikes`)},
                icon: <Favorite sx={{ color: iconColor }} />,
                notifs: sizeLikes
            },
            "Messages": {
                onClick: () => {navigate(`/chat`)},
                icon: <Chat sx={{ color: iconColor }} />,
                notifs: sizeMessages
            },
            "Historique": {
                onClick: () => {navigate(`/feedHistorics`)},
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
                onClick: async() => {
                    const config = {
                        headers: {
                          Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
                        },
                      };
                    await axios.put(`http://localhost:3000/api/user/connexion/me/off`,{},config);
                    ctx.logout()
                },
                icon: <Logout sx={{ color: iconColor }} />,
                notifs: 0
            }
        }
    ], [sizeViews, sizeLikes, sizeMessages]);

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