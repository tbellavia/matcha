import styles from "./ChatProfile.module.css"
import { useRef } from "react";
import React , { useEffect } from "react";
import Photo from "../photo/Photo";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AppContext from "../../../store/AppContext";
import { base64ToFile } from "../../../common/utils";
import socket from "../../../socket";
import axios from "axios";

function ChatProfile({chatProfile}){
    const navigate = useNavigate()
    const [idProfile, setIdProfile] = useState(false);
    const [curentNotif, setCurentNotif] = useState(0);
    const [curentMessage, setCurentMessage] = useState(chatProfile.message)
    const ctx = useContext(AppContext)

    const getIdProfile = async() => {
        const config = {
            headers: {
              Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
            },
          };
        const res = await axios.get('http://localhost:3000/api/user/profile/getId/me',config)
        setIdProfile(res.data.id)

    }

    useEffect(() => {
        getIdProfile();
    }, []);

    useEffect(()=>{
        // getIdProfile()
        const notifCount = ctx.notifs.messages[chatProfile.iduser] || 0;
        setCurentNotif(notifCount);
        // if (curentNotif && curentNotif > 0){
        //     setCurentNotif(ctx.notifs.messages[chatProfile.iduser])
        // }
    }, [ctx.notifs.messages[chatProfile.iduser]])

    const onClickHandlerChat = () => {
        navigate(`/chat/${chatProfile.iduser}`);
    }

    const onClickHandlerProfile = () => {
        navigate(`/profile/${chatProfile.iduser}`);
    }

    const onClickHandlerDelChat = () => {
        
    }

    const notif = () => {
        const curentNotif = ctx.notifs.messages[chatProfile.iduser]
        if(curentNotif && curentNotif > 0){

    // const notif = ([curentNotif]) => {
    //     const curentNotif = ctx.notifs.messages[chatProfile.iduser]
    //     if(curentNotif > 0){
            return <div className={styles.rondtrue}>{curentNotif}</div>
        }
        return
    }

    useEffect(() => {
        
        function messagesEnter({from, message}){
            if (from == chatProfile.iduser){
                console.log("new message", message)
                setCurentNotif(prev => prev + 1)
                setCurentMessage(message)
                // curentNotif += 1;
                
            }
           
        }
            // ctx.setNotifs({"likes":{...ctx.notifs.likes},"messages":{...ctx.notifs.messages, from : (ctx.notifs.messages[from]?ctx.notifs.messages[from]+1:1)},"likes":{...ctx.notifs.likes}})
        socket.connect()

        socket.on(`messages${idProfile}`, messagesEnter)

        return () => {
          socket.off(`messages${idProfile}`)
          socket.disconnect();
        }
      },[idProfile]) 

    return(
    
        <div className={`${styles[`chatProfile__${ctx.theme}`]} ${styles.chatProfile}`}>
            
            <Photo size='medium' data={base64ToFile(chatProfile.photo)} onClick={onClickHandlerProfile}/>
            <div className={styles.divInfo} onClick={onClickHandlerChat}>
                <div className={styles.divNameDate}>
                    <span className={styles.spanName}>{chatProfile.name}</span>
                    <span className={styles.spanDate}>{chatProfile.date}</span>
                </div>
                    <div className={`${styles[`divMessage__${ctx.theme}`]} ${styles.divMessage}`}>
                        <span className={styles.spanMessage}>{curentMessage}</span>
                        {/* <div className={styles.rondtrue}>{curentNotif}</div> */}
                        {/* {notif()} */}
                        {curentNotif > 0 && <div className={styles.rondtrue}>{curentNotif}</div>}
                        {/* {curentNotif} */}
                    </div>
            </div>
            <button className={`${styles[`buttonDel__${ctx.theme}`]} ${styles.buttonDel}`} onClick={onClickHandlerDelChat}>X</button>

        </div>
    )
}

export default ChatProfile