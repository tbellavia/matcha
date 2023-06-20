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
import styles from "./FeedHistorics.module.css"
import Header from "../../components/ui/header/Header";
import ChatProfile from "../../components/ui/chatProfile/ChatProfile";
import AppDropdown from "../../components/ui/drawer-menu/AppDropdown";
import FeedProfile from "../../components/ui/feedProfile/FeedProfile";

function FeedHistorics (){
  const [AllProfile, setAllProfile] = useState([])
  const ctx = useContext(AppContext)

  const [allConnexion, setAllConnexion] = useState({})
  const getAllProfileForFeed = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    const res = await axios.get(`http://localhost:3000/api/user/views/me`,config).then((response) => response.data);
    console.log(res)
    setAllProfile(res.result.map(elem => {
      return({iduser : elem.id, 
        name:elem.first_name,
        photo:elem.photo1})
      
    }))
  }

  const getUserConnexion= async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    const res = await axios.get(`http://localhost:3000/api/user/connexion`,config).then((response) => response.data);
    await axios.put(`http://localhost:3000/api/user/connexion/me/on`,{},config);
    console.log(res)
    
    setAllConnexion(res)
  }

  useEffect(()=>{
    getAllProfileForFeed()
    getUserConnexion()
  },[])

  useEffect(() => {

        function newConnexionEnter({profileId, status}){
            console.log(`session ${profileId} ${status}`)
            setAllConnexion({ ...allConnexion, [profileId]: status })
        }
        
        socket.connect()
        socket.on(`newConnexion`, newConnexionEnter)

        return () => {
          socket.off(`newConnexion`)
          socket.disconnect();
        }
      },[]) 

  return (

      <GenericPage className={styles.page}>
        <AppDropdown/>
        <div className={styles.allChatPage}>
          {AllProfile.map((elem, index) =>
              <FeedProfile key={index} profile={elem} isConnected={allConnexion[elem.iduser]}/>
          )}
        </div>
      </GenericPage>
    );
}

export default FeedHistorics;