import GenericPage from "../page/GenericPage";
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import Button from "../../components/ui/button/Button";
import socket from "../../socket";
import styles from "./Feed.module.css"
import FeedProfile from "../../components/ui/feedProfile/FeedProfile";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import FilterModal from "../../components/ui/filters/FilterModal";

function Feed() {
  const [AllProfile, setAllProfile] = useState([])
  const ctx = useContext(AppContext)
  const [allConnexion, setAllConnexion] = useState({})
  const [filterParams, setFilterParams] = useState([])
  const [myTags, setMyTags] = useState([])
  const [isConnexionSet, setIsConnexionSet] = useState(false)

  const filterCommonTags = (myTags, otherTags, minCommon) => {
    if (myTags.length === 0 || minCommon === 0) {
      return true;
    }
    const commonTags = myTags.map(word => word).filter(word => otherTags.some(tag => tag.toLowerCase() === word));
    return commonTags.length >= minCommon;
  }

  const getAllProfileForFeed = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, 
      },
    };
    try {
      const res = await axios.get(`http://localhost:3000/api/user/profile`, config);
      const tags = await axios.get(`http://localhost:3000/api/user/profile/me`, config);
      setMyTags(tags.data.tags.toLowerCase().split(','))
      const myFilterTags = tags.data.filtertags.length ? tags.data.filtertags?.toLowerCase().split(',') : [];
      setAllProfile(res.data.result
        .filter(elem => filterCommonTags(myTags, elem.tags.split(','), 0)) // TODO : Keep this one ? or Only fiteredTags ?
        .filter(elem => filterCommonTags(myFilterTags, elem.tags.split(','), myFilterTags.length))
        .map(elem => {
          return ({
            iduser: elem.id,
            name: elem.first_name,
            photo: elem.photo1,
            tags: elem.tags,
            love: elem.love
          })

        }))
    }
    catch (e) { }
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
    } catch (e) {

    }

  }

  useEffect(() => {
    getAllProfileForFeed()
    getUserConnexion()
  }, [filterParams, isConnexionSet])

  useEffect(() => {


    function newConnexionEnter({ profileId, status }) {
      setAllConnexion(prev => ({ ...prev, [profileId]: status }))
    }
    if (!socket.connected) {

      if (!socket.connected) {
        socket.connect();
      }

    }

    socket.on(`newConnexion`, newConnexionEnter)

    return () => {
      socket.off(`newConnexion`)
    }
  }, [isConnexionSet])


  // Filter Modal

  const [open, setOpen] = useState(false);

  const onModalOpen = () => setOpen(true);
  const onModalClose = (params) => {
    setFilterParams(params)
    setOpen(false);
  }


  return (

    <GenericPage className={styles.page}>
      <ProfileHeader menuOnly={false} />
      <Button className={`${styles[`filterButton_${ctx.theme}`]} ${styles.filterButton}`} onClick={onModalOpen}>Filtres</Button>
      <FilterModal open={open} onClose={onModalClose} myTags={myTags} />

      <div className={styles.allChatPage}>
        {AllProfile.map((elem, index) =>
          <FeedProfile key={index} profile={elem} isConnected={allConnexion[elem.iduser]} />
        )}
        {!AllProfile.length && <h1>Oh non, personne ne te convient :( Essaie d'ajuster tes filtres</h1>}
      </div>
    </GenericPage>
  );
}

export default Feed;