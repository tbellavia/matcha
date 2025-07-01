import styles from "./ChatProfile.module.css"
import { useEffect } from "react";
import Photo from "../photo/Photo";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AppContext from "../../../store/AppContext";
import { base64ToFile } from "../../../common/utils";
import socket from "../../../socket";
import axios from "axios";
import useFetch from "../../../hooks/use-fetch";

function ChatProfile({chatProfile}){
    const fetcher = useFetch();
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
            fetcher(`/api/user/unlike/me/${chatProfile.iduser}`, "POST");
            window.location.reload();
    }

    useEffect(() => {
        if (!idProfile) return;

        if (!socket.connected) {
         socket.connect();
        }
        function messagesEnter({from, message}){
            if (from == chatProfile.iduser){
                setCurentNotif(prev => prev + 1)
                setCurentMessage(message)
            }
           
        }
        socket.on(`messages${idProfile}`, messagesEnter)

        return () => {
          socket.off(`messages${idProfile}`)
        }
      },[idProfile]) 

    return(
    
        <div className={`${styles[`chatProfile__${ctx.theme}`]} ${styles.chatProfile}`}>
            
            {chatProfile.photo && <Photo size='medium' data={base64ToFile(chatProfile.photo)} onClick={onClickHandlerProfile}/>}
            <div className={styles.divInfo} onClick={onClickHandlerChat}>
                <div className={styles.divNameDate}>
                    <span className={styles.spanName}>{chatProfile.name}</span>
                    <span className={styles.spanDate}>{chatProfile.date}</span>
                </div>
                    <div className={`${styles[`divMessage__${ctx.theme}`]} ${styles.divMessage}`}>
                        {curentMessage != null && <span className={styles.spanMessage}>{curentMessage}</span>}

                        {/* <span className={styles.spanMessage}>{curentMessage}</span> */}
                        {curentMessage == null && <span className={styles.spanMessage}>DÉMARRER LA CONVERSATION</span>}

                        {/* <div className={styles.rondtrue}>{curentNotif}</div> */}
                        {/* {notif()} */}
                        {/* {curentNotif > 0 && <div className={styles.rondtrue}>{curentNotif}</div>} */}
                        {curentNotif > 0 && <div className={`${styles[`rondtrue__${ctx.theme}`]}`}>{curentNotif}</div>}
                        {/* {curentNotif == 0 && <div className={styles.rondtrue}>DÉMARRER LA CONVERSATION</div>} */}
                        {/* {curentNotif} */}
                    </div>
            </div>
            <button className={`${styles[`buttonDel__${ctx.theme}`]} ${styles.buttonDel}`} onClick={onClickHandlerDelChat}>X</button>

        </div>
    )
}

export default ChatProfile