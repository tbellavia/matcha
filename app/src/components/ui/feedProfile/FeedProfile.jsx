import styles from "./FeedProfile.module.css"
import Photo from "../photo/Photo";
import { useNavigate } from "react-router-dom";
import { base64ToFile } from "../../../common/utils";
import useFetch from "../../../hooks/use-fetch";
import LoveState from "../../../pages/profile/components/button-groups/LoveState";
import { useEffect, useState } from "react";

function FeedProfile({profile, notification, isConnected, color="light"}){
    const navigate = useNavigate()
    const fetcher = useFetch()
    const [loveState, setLoveState] = useState([0,0]);
    const onClickHandlerProfile = async () => {
        try {
            await fetcher(`/api/user/views/me/${profile.iduser}`, "POST");
            navigate(`/profile/${profile.iduser}`);
        } catch (e) {
       }
    }

    useEffect(() => {
        setLoveState(profile.love);
    },[])

    const notif = () => {
        if(notification){
            return <div className={styles.rondtrue}> </div>
        }
        return
    }

    const connected = () => {
        if(isConnected === true){
            return <div className={styles.connecttrue}> </div>
        }
        else if(isConnected){
            return <div className={styles.connectfalse}>{isConnected}</div>
        }
        return
    }

    const loveStatus = () => {
        if (profile.love[0] !== 0 || profile.love[1] !== 0) {
            return <div className={styles.loveStatus}><LoveState love={loveState} target={0} /></div>
        }
    }


    return(
    
        <div className={styles.oneProfile} onClick={onClickHandlerProfile}>
            {profile.photo && <Photo color={color} size='feedSize' className={styles.photoBack} data={base64ToFile(profile.photo)}/>}
            {notif()}
            {connected()}
            {loveStatus()}
            <div className={styles.name}>{profile.name}</div>
        </div>
    )
}

export default FeedProfile