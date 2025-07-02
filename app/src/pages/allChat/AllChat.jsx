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
import styles from "./AllChat.module.scss"
import Header from "../../components/ui/header/Header";
import ChatProfile from "../../components/ui/chatProfile/ChatProfile";
import AppDropdown from "../../components/ui/drawer-menu/AppDropdown";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";

function AllChat (){
  const [AllChatProfile, setAllChatProfile] = useState([])
  const ctx = useContext(AppContext)
  
  
  const getAllChatProfile = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    };
    try {
      const res = await axios.get(`http://localhost:3000/api/user/chat/me`,config);
      setAllChatProfile(res.data.result.map(elem => {
        return({iduser : elem.idprofileuser,
          name:elem.first_name,
          message:elem.mess,
          photo:elem.photo1,
          idChat:elem.idchat,
          date:elem.date_envoi})
      }))
    } catch (e) {}
  }

  useEffect(()=>{
    getAllChatProfile()
  },[])

  return (

      <GenericPage className={styles.page}>
        {/* <AppDropdown/> */}
        <ProfileHeader menuOnly={false}/>

        <div className={styles.allChatPage}>
          {AllChatProfile.map((elem, index) =>
              <ChatProfile key={index} chatProfile={elem}/>
          )}
          {!AllChatProfile.length && <h1>Tu pourras échanger avec d'autres personnes après un match!</h1>}
        </div>
      </GenericPage>
    );
}

export default AllChat;