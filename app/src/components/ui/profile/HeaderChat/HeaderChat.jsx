import {useEffect, useState} from "react";
import styles from "./HeaderChat.module.css";
import { useContext } from "react";
import AppContext from "../../../../store/AppContext";
import Photo from "../../photo/Photo";
import { base64ToFile } from "../../../../common/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HeaderChat({profileId = -1}) {
    const navigate = useNavigate()
    const ctx = useContext(AppContext)
    const [infos, setInfos] = useState({})


    const getAllChatProfile = async() =>{
        const config = {
          headers: {
            Authorization: `Bearer ${ctx.token}`,
          },
        };
        try {
            const res = await axios.get(`http://localhost:3000/api/user/profile/${profileId}`,config);
            setInfos(res.data.result)
        } catch (e) {}
    }

    useEffect(()=>{
        getAllChatProfile()
      },[profileId])

    const onClickHandlerProfile = () => {
        navigate(`/profile/${infos.id}`);
    }

    return (
        <div className={styles.chatProfile}>
            {infos.photo1 && <Photo size='medium' data={base64ToFile(infos.photo1)} onClick={onClickHandlerProfile}/>}
            <span className={`${styles[`spanName__${ctx.theme}`]} ${styles.spanName}`} onClick={onClickHandlerProfile}>{`${infos.first_name} ${infos.last_name}`}</span>
        </div>
    )
}

export default HeaderChat;