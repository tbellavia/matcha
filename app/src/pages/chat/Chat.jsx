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
import styles from "./Chat.module.css"
import Header from "../../components/ui/header/Header";

function Chat (){
  const [message, setMessage] = useState("")
  const [AllChat, setAllChat] = useState([])
  const [chatId, setChatId] = useState(false)
  const [userId, setUserId] = useState(false)
  const [to] = useState(useParams().id)
  const ctx = useContext(AppContext)
  

  const requetPost = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    const res = await axios.post(`http://localhost:3000/api/user/chat/message/me/${to}`,{message:message},config);
    
  }

  const onMessageSubmit = (e) => {
    // console.log(message)
    if (message.trim()){
      socket.emit("message", {message, name:userId, to:chatId})
      requetPost()
      setMessage("")
    }
    
    e.preventDefault()
  }

  const onMessageHeandler = (e) => {
    setMessage(e.target.value)
  }

  const getOldChat = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    const res = await axios.get(`http://localhost:3000/api/user/chat/me/${to}?limit=100&skip=0`,config).then((response) => response.data);

    setAllChat(res.result.map(elem => {
      return({user : elem.userwrite, message:elem.mess})
    }))
    setChatId(res.chatId)
    setUserId(res.userId)
  }

  const delNotif = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    const res = await axios.put(`http://localhost:3000/api/user/notifs/del/messages/${to}`,{},config);
  }


  useEffect(()=>{
    getOldChat()
    delNotif()
  },[])

  useEffect(() => {
    console.log(`chatId ${chatId}`)
    function messageEnter({message, name}){
      setAllChat(previous=>[...previous, {user:name, message}])
      console.log(`message recu : ${message} ${name}`)
    }
    socket.connect()
    socket.on(chatId, messageEnter)

    return () => {
      socket.off(chatId, messageEnter)
      socket.disconnect();
    }
  },[chatId])

  return (

      <GenericPage className={styles.page}>
        
        <div className={styles.chatPage}>
        <ChatMessage me={userId}  allChat={AllChat}/>
        <form onSubmit={onMessageSubmit}>
            <input type="text" className={styles.inputChat} value={message} onChange={onMessageHeandler}/>
            <button 
                type="submit"
                className={styles.buttonChat}>
              {'>'}
            </button>
        </form>
        </div>
      </GenericPage>
    );
}

export default Chat;