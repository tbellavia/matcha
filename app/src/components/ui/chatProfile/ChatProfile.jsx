import styles from "./ChatProfile.module.css"
import { useRef } from "react";
import React , { useEffect } from "react";
import Photo from "../photo/Photo";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import { base64ToFile } from "../../../common/utils";

function ChatProfile({chatProfile}){
    const navigate = useNavigate()
    const ctx = useContext(AppContext)

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
            return <div className={styles.rondtrue}>{curentNotif}</div>
        }
        return
    }

    return(
    
        <div className={`${styles[`chatProfile__${ctx.theme}`]} ${styles.chatProfile}`}>
            
            <Photo size='medium' data={base64ToFile(chatProfile.photo)} onClick={onClickHandlerProfile}/>
            <div className={styles.divInfo} onClick={onClickHandlerChat}>
                <div className={styles.divNameDate}>
                    <span className={styles.spanName}>{chatProfile.name}</span>
                    <span className={styles.spanDate}>{chatProfile.date}</span>
                </div>
                    <div className={`${styles[`divMessage__${ctx.theme}`]} ${styles.divMessage}`}>
                        <span className={styles.spanMessage}>{chatProfile.message}</span>
                        {notif()}
                    </div>
            </div>
            <button className={`${styles[`buttonDel__${ctx.theme}`]} ${styles.buttonDel}`} onClick={onClickHandlerDelChat}>X</button>

        </div>
    )
}

export default ChatProfile