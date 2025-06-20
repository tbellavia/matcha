import styles from "./FeedProfile.module.css"
import Photo from "../photo/Photo";
import { useNavigate } from "react-router-dom";
import { base64ToFile } from "../../../common/utils";
import useFetch from "../../../hooks/use-fetch";

function FeedProfile({profile, notification, isConnected}){
    const navigate = useNavigate()
    const fetcher = useFetch()
    const onClickHandlerProfile = async () => {
        try {
            await fetcher(`/api/user/views/me/${profile.iduser}`, "POST");
            navigate(`/profile/${profile.iduser}`);
        } catch (e) {
       }
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
            return <div className={styles.connectfalse}>{isConnected}</div>
        }
        return
    }


    return(
    
        <div className={styles.oneProfile} onClick={onClickHandlerProfile}>
            {profile.photo && <Photo size='feedSize' className={styles.photoBack} data={base64ToFile(profile.photo)}/>}
            {notif()}
            {connected()}
            <div className={styles.name}>{profile.name}</div>
        </div>
    )
}

export default FeedProfile