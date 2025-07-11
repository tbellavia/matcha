import GenericPage from "../page/GenericPage";
import { useParams } from 'react-router-dom';
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useContext } from "react";
import { useState , useEffect} from "react";
import socket from "../../socket";
import ChatMessage from "../../components/ui/chatMessage/ChatMessage";
import styles from "./Chat.module.css"
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import HeaderChat from "../../components/ui/profile/HeaderChat/HeaderChat";
import { useNavigate } from "react-router-dom";

function Chat (){
  const [message, setMessage] = useState("")
  const [AllChat, setAllChat] = useState([])
  const [chatId, setChatId] = useState(false)
  const [userId, setUserId] = useState(false)
  const [to] = useState(useParams().id)
  const ctx = useContext(AppContext)
  const navigate = useNavigate()
  

  const requetPost = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    };
    try {
      await axios.post(`http://localhost:3000/api/user/chat/message/me/${to}`,{message:message},config);
    } catch (e) {
      navigate(`/chat`)
    }
    
  }

  const onMessageSubmit = (e) => {
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
        Authorization: `Bearer ${ctx.token}`,
      },
    };
    try {
      const res = await axios.get(`http://localhost:3000/api/user/chat/me/${to}?limit=100&skip=0`,config);
      setAllChat(res.data.result.map(elem => {
        return({user : elem.userwrite, message:elem.mess})
      }))
      setChatId(res.data.chatId)
      setUserId(res.data.userId)
    } catch (e) {
      navigate(`/chat`)
    }
  }

  const delNotif = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    };
    try {
      await axios.put(`http://localhost:3000/api/user/notifs/del/messages/${to}`,{},config);
    } catch (e) {}
  }


  useEffect(()=>{
    getOldChat()
    delNotif()
  },[])

  useEffect(() => {
        if (!chatId) return;

        if (!socket.connected) {
         socket.connect();
        }
    function messageEnter({message, name}){
      setAllChat(previous=>[...previous, {user:name, message}])
    }
    socket.on(chatId, messageEnter)

    return () => {
      socket.off(chatId, messageEnter)
    }
  },[chatId])

  return (

      <GenericPage className={styles.page}>
        <ProfileHeader menuOnly={false} ipMessage={to} />
        <HeaderChat profileId={to}/>
        <div className={styles.chatPage}>
          <ChatMessage me={userId}  allChat={AllChat}/>
          <form className={styles.inputChatAndButton} onSubmit={onMessageSubmit}>
              <input id="text" type="text" className={styles.inputChat} value={message} onChange={onMessageHeandler} autoFocus/>
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