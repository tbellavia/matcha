import GenericPage from "../page/GenericPage";
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useContext } from "react";
import { useState , useEffect} from "react";
import socket from "../../socket";
import styles from "./FeedViews.module.css"
import FeedProfile from "../../components/ui/feedProfile/FeedProfile";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";

function FeedViews (){
  const [AllProfile, setAllProfile] = useState([])
  const ctx = useContext(AppContext)
  const [notifs, setNotifs] = useState({})
  const [allConnexion, setAllConnexion] = useState({})
  const getAllProfileForFeed = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    const res = await axios.get(`http://localhost:3000/api/user/views`,config).then((response) => response.data);
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
    const res2 = await axios.get(`http://localhost:3000/api/user/notifs/views`,config).then((response) => response.data);
    await axios.put(`http://localhost:3000/api/user/notifs/del/views`,{},config);
    setNotifs(res2)
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
        <ProfileHeader menuOnly={false}/>
        <div className={styles.allChatPage}>
          {AllProfile.map((elem, index) =>
              <FeedProfile key={index} profile={elem} notification={notifs[elem.iduser.toString()]} isConnected={allConnexion[elem.iduser]}/>
          )}
        </div>
      </GenericPage>
    );
}

export default FeedViews;