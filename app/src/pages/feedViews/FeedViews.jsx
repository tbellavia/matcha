import GenericPage from "../page/GenericPage";
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import socket from "../../socket";
import styles from "./FeedViews.module.css"
import FeedProfile from "../../components/ui/feedProfile/FeedProfile";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";

function FeedViews() {
  const [AllProfile, setAllProfile] = useState([])
  const ctx = useContext(AppContext)
  const [notifs, setNotifs] = useState({})
  const [allConnexion, setAllConnexion] = useState({})
  const [isConnexionSet, setIsConnexionSet] = useState(false)
  const getAllProfileForFeed = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, 
      },
    };
    try {
      const res = await axios.get(`http://localhost:3000/api/user/views`, config);
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
      const res2 = await axios.get(`http://localhost:3000/api/user/notifs/views`, config);
      await axios.put(`http://localhost:3000/api/user/notifs/del/views`, {}, config);
      setNotifs(res2.data)
    } catch (e) { }
  }

  useEffect(() => {
    getAllProfileForFeed()
    getUserConnexion()
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
  }, [isConnexionSet])

  return (

    <GenericPage className={styles.page}>
      <ProfileHeader menuOnly={false} viewPage={true} />
      <div className={styles.allChatPage}>
        {AllProfile.map((elem, index) =>
          <FeedProfile key={index} profile={elem} notification={notifs[elem.iduser.toString()]} isConnected={allConnexion[elem.iduser]} />
        )}
        {!AllProfile.length && <h1>Personne n'a encore consulté ton profil :(</h1>}
      </div>
    </GenericPage>
  );
}

export default FeedViews;