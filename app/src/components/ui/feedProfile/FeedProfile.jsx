import styles from "./FeedProfile.module.css"
import { useRef, useState } from "react";
import React , { useEffect } from "react";
import Photo from "../photo/Photo";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../../../store/AppContext";
import { base64ToFile } from "../../../common/utils";
import socket from "../../../socket";

function FeedProfile({profile, notification, isConnected}){
    const navigate = useNavigate()
    // const ctx = useContext(AppContext)

    // useEffect(() => {

    //     function sessionEnter({infos}){
    //         console.log(`session ${profile.iduser} ${infos}`)
    //         setSession(infos)
    //     }
        
    //     socket.connect()
    //     socket.on(`session${profile.iduser}`, sessionEnter)

    //     return () => {
    //       socket.off(`session${profile.iduser}`)
    //       socket.disconnect();
    //     }
    //   },[]) 

    
    

    const onClickHandlerProfile = () => {
        navigate(`/profile/${profile.iduser}`);
    }

    const notif = () => {
        if(notification){
            return <div className={styles.rondtrue}> </div>
        }
        return
    }

    const connected = () => {
        if(isConnected == true){
            return <div className={styles.connecttrue}> </div>
        }
        else if(isConnected){
            // new Date().toISOString().slice(0,16).replace(/-/g, '/').replace(/T/g, ' ')
            return <div className={styles.connectfalse}>{isConnected}</div>
        }
        return
    }


    return(
    
        <div className={styles.oneProfile} onClick={onClickHandlerProfile}>
            <Photo size='feedSize' className={styles.photoBack} data={base64ToFile(profile.photo)}/>
            {notif()}
            {connected()}
            <div className={styles.name}>{profile.name}</div>
        </div>
    )
}

export default FeedProfile