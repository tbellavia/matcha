import GenericPage from "../page/GenericPage";
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import socket from "../../socket";
import styles from "./FeedHistorics.module.css"
import FeedProfile from "../../components/ui/feedProfile/FeedProfile";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";

function FeedHistorics() {
  const [AllProfile, setAllProfile] = useState([])
  const ctx = useContext(AppContext)
  const [isConnexionSet, setIsConnexionSet] = useState(false)

  const [allConnexion, setAllConnexion] = useState({})
  const getAllProfileForFeed = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, 
      },
    };
    try {
      const res = await axios.get(`http://localhost:3000/api/user/views/me`, config);
      setAllProfile(res.data.result.map(elem => {
        return ({
          iduser: elem.id,
          name: elem.first_name,
          photo: elem.photo1,
          love : elem.love
        })

      }))
    } catch (e) { }
  }

  const getUserConnexion = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, 
      },
    };
    try {
      const res = await axios.get(`http://localhost:3000/api/user/connexion`, config);
      await axios.put(`http://localhost:3000/api/user/connexion/me/on`, {}, config);
      setIsConnexionSet(true)
      setAllConnexion(res.data)
    } catch (e) { }
  }

  useEffect(() => {
    getAllProfileForFeed()
    getUserConnexion()
    // eslint-disable-next-line
  }, [isConnexionSet])

  useEffect(() => {

    function newConnexionEnter({ profileId, status }) {
      setAllConnexion({ ...allConnexion, [profileId]: status })
    }


    if (!socket.connected) {
      socket.connect();
    }
    socket.on(`newConnexion`, newConnexionEnter)

    return () => {
      socket.off(`newConnexion`)
    }
    // eslint-disable-next-line
  }, [isConnexionSet])

  return (

    <GenericPage className={styles.page}>
      <ProfileHeader menuOnly={false} />

      <div className={styles.allChatPage}>
        {AllProfile.map((elem, index) =>
          <FeedProfile key={index} profile={elem} isConnected={allConnexion[elem.iduser]} />
        )}
        {!AllProfile.length && <h1>C'est ici que tu verras les profils que tu as déjà consulté</h1>}
      </div>
    </GenericPage>
  );
}

export default FeedHistorics;