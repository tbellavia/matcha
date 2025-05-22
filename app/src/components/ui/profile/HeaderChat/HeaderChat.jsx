import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useFetch from "../../../../hooks/use-fetch";
import styles from "./HeaderChat.css";
import { useContext } from "react";
import AppContext from "../../../../store/AppContext";
import Photo from "../../photo/Photo";
import { base64ToFile } from "../../../../common/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HeaderChat({profileId = -1}) {
    const navigate = useNavigate()
    const ctx = useContext(AppContext)
    const {id} = useParams();
    const [infos, setInfos] = useState({})
    const profile = useProfile();


    const getAllChatProfile = async() =>{
        const config = {
          headers: {
            Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
          },
        };
        const res = await axios.get(`http://localhost:3000/api/user/profile/${profileId}`,config).then((response) => response.data);
        console.log(res.result)
        setInfos(res.result)
    }

    useEffect(()=>{
        getAllChatProfile()
      },[profileId])

    const onClickHandlerChat = () => {
        navigate(`/chat/${infos.id}`);
    }

    const onClickHandlerProfile = () => {
        navigate(`/profile/${infos.id}`);
    }

    return (
        <div className={`${styles[`chatProfile__${ctx.theme}`]} ${styles.chatProfile}`}>
            <Photo size='medium' data={base64ToFile(infos.photo1)} onClick={onClickHandlerProfile}/>
            <div className={styles.divInfo} onClick={onClickHandlerChat}>
                <div className={styles.divNameDate}>
                    <span className={styles.spanName}>{infos.first_name} {infos.last_name}</span>
                </div>
            </div>
        </div>
    )
}



function useProfile() {
    const fetcher = useFetch();
    return {
        fetch: async function (id) {
            const response = await fetcher(`/api/user/profile/${id}`);

            return response?.data;
        }
    }
}

export default HeaderChat;