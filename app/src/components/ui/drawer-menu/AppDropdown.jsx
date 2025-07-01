import { AccountCircle, Chat, Favorite, History, Logout, RemoveRedEye, Settings, Group, Tune } from "@mui/icons-material";
import Dropdown from "./Dropdown";
import { Box, keyframes } from "@mui/material";
import { useContext, useState , useEffect, useMemo} from "react";
import SettingsModal from "./modals/Settings/SettingsModal";
import AppContext from "../../../store/AppContext";
import socket from "../../../socket";
import soundFile from '../../../assets/son/son1.mp3';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AppDroddown({ipMessage = -1}) {
    const ctx = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [idProfile, setIdProfile] = useState(false);
    const [sizeViews, setSizeViews] = useState(0)
    const [sizeLikes, setSizeLikes] = useState(0)
    const [sizeMessages, setSizeMessages] = useState(0)
    const navigate = useNavigate()
 
    const onSettingsClickHandler = () => {
        setOpen(true);
    }

    const [notify, setNotify] = useState(sizeViews + sizeLikes + sizeMessages)

    useEffect(()=>{
        setNotify(sizeViews + sizeLikes + sizeMessages)
    }, [sizeViews, sizeLikes, sizeMessages])
    

    const getIdProfile = async() => {
        const config = {
            headers: {
              Authorization: `Bearer ${ctx.token}`,
            },
          };

          try{
            const res = await axios.get('http://localhost:3000/api/user/profile/getId/me',config)
            const notifRes = await axios.get('http://localhost:3000/api/user/notifs',config)
            ctx.setNotifs(notifRes.data)
            setSizeViews(Object.entries(notifRes.data.views).filter(([key, value]) => value === true).length)
            setSizeLikes(Object.entries(notifRes.data.likes).filter(([key, value]) => value === true).length)
            setSizeMessages(Object.entries(notifRes.data.messages).filter(([key, value]) => value > 0).length)
            setIdProfile(res.data.id)
          }
          catch(e){
          }



    }

    useEffect(()=>{
        getIdProfile()
    }, [])

    const delNotif = async() =>{
        const config = {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        };
        const res = await axios.put(`http://localhost:3000/api/user/notifs/del/messages/${ipMessage}`,{},config);
      }

    useEffect(() => {
        if (!idProfile) return;

        if (!socket.connected) {
         socket.connect();
        }
        console.log("socket co")
        function viewEnter({from}){
            const audio = new Audio(soundFile);
            audio.play();
            console.log(ctx.notifs.views)
            console.log(`views ${from}`)
            ctx.setNotifs({"views":{...ctx.notifs.views, from : true},"messages":{...ctx.notifs.messages},"likes":{...ctx.notifs.likes}})
            setSizeViews(prev => prev + 1)
        }

        function likeEnter({from}){
            const audio = new Audio(soundFile);
            audio.play();
            console.log(ctx.notifs.likes)
            console.log(`likes ${from}`)
            ctx.setNotifs({"likes":{...ctx.notifs.likes, from : true},"messages":{...ctx.notifs.messages},"views":{...ctx.notifs.views}})
            setSizeLikes(prev => prev + 1)
        }

        function messagesEnter({from}){
            const audio = new Audio(soundFile);
            audio.play();
            console.log(ctx.notifs.likes)
            console.log(`message ${from}`)
            if (from != ipMessage){
                ctx.setNotifs({"likes":{...ctx.notifs.likes},"messages":{...ctx.notifs.messages, from : (ctx.notifs.messages[from]?ctx.notifs['messages'][from]+1:1) },"views":{...ctx.notifs.views}})
                setSizeMessages(prev => prev + 1)
            }
            else{
                delNotif();
            }
           
        }

        socket.on(`view${idProfile}`, viewEnter)
        socket.on(`like${idProfile}`,likeEnter)
        socket.on(`messages${idProfile}`, messagesEnter)
        socket.on(`match${idProfile}`,messagesEnter)

        return () => {
          socket.off(`likes${idProfile}`)
          socket.off(`view${idProfile}`)
          socket.off(`messages${idProfile}`)
          socket.off(`match${idProfile}`)
        }
      },[idProfile]) 
    
    const appDropddownItems = useMemo(()=>[
        {
            "Mon Profil": {
                onClick: () => {navigate(`/profile/${idProfile}`)},
                icon: <AccountCircle sx={{ color: iconColor }} />,
                notifs: 0
            },
            "Feed": {
                onClick: () => {navigate(`/feed`)},
                icon: <Group sx={{ color: iconColor }} />,
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
                          Authorization: `Bearer ${ctx.token}`,
                        },
                      };
                    await axios.put(`http://localhost:3000/api/user/connexion/me/off`,{},config);
                    ctx.logout()
                },
                icon: <Logout sx={{ color: iconColor }} />,
                notifs: 0
            }
        }
    ], [sizeViews, sizeLikes, sizeMessages, idProfile]);

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

            <SettingsModal open={open} handleClose={handleClose} />
        </Box>
    )
}

const iconColor = "var(--color-light-8)";

const bounce = keyframes`
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 
        40% { transform: translateY(-2px); } 
        60% { transform: translateY(-5px); } 
`;