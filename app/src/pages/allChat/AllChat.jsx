import GenericPage from "../page/GenericPage";
import { useParams } from 'react-router-dom';
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useContext } from "react";
import { io } from 'socket.io-client';
import { useState , useEffect} from "react";
import Button from "../../components/ui/button/Button";
import socket from "../../socket";
import ChatMessage from "../../components/ui/chatMessage/ChatMessage";
import styles from "./AllChat.module.css"
import Header from "../../components/ui/header/Header";
import ChatProfile from "../../components/ui/chatProfile/ChatProfile";
import AppDropdown from "../../components/ui/drawer-menu/AppDropdown";

function AllChat (){
  const [AllChatProfile, setAllChatProfile] = useState([])
  const ctx = useContext(AppContext)
  
  
  const getAllChatProfile = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    const res = await axios.get(`http://localhost:3000/api/user/chat/me`,config).then((response) => response.data);

    setAllChatProfile(res.result.map(elem => {
      return({iduser : elem.idprofileuser, 
        name:elem.first_name,
        message:elem.mess,
        photo:elem.photo1,
        idChat:elem.idchat,
        date:elem.date_envoi})
      
    }))
  }

  useEffect(()=>{
    getAllChatProfile()
  },[])

  return (

      <GenericPage className={styles.page}>
        <AppDropdown/>
        <div className={styles.allChatPage}>
          {AllChatProfile.map((elem, index) =>
              <ChatProfile key={index} chatProfile={elem}/>
          )}
        </div>
      </GenericPage>
    );
}

export default AllChat;