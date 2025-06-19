import GenericPage from "../page/GenericPage";
import axios from "axios";
import AppContext from "../../store/AppContext";
import { useContext } from "react";
import { useState , useEffect} from "react";
import Button from "../../components/ui/button/Button";
import socket from "../../socket";
import styles from "./Feed.module.css"
import FeedProfile from "../../components/ui/feedProfile/FeedProfile";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import FilterModal from "../../components/ui/filters/FilterModal";

function Feed (){
  const [AllProfile, setAllProfile] = useState([])
  const ctx = useContext(AppContext)
  const [allConnexion, setAllConnexion] = useState({})
  const [filterParams, setFilterParams] = useState([])
  const [myTags, setMyTags] = useState([])

  const filterCommonTags = (myTags, otherTags, minCommon) => {
    if (myTags.length == 0 || minCommon === 0) {
      return true;
    }
    // console.log(otherTags)
    const commonTags = myTags.map(word => word).filter(word => otherTags.some(tag => tag.toLowerCase() === word));
    return commonTags.length >= minCommon;
  }

  const getAllProfileForFeed = async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
      try {
        const res = await axios.get(`http://localhost:3000/api/user/profile`,config).then((response) => response.data);
        const tags = await axios.get(`http://localhost:3000/api/user/profile/me`,config).then((response) => response.data);
        console.log("getAllProfileForFeed");
        console.log(res)
        setMyTags(tags.tags.toLowerCase().split(','))
        const myFilterTags = tags.filtertags.length ? tags.filtertags?.toLowerCase().split(',') : [];
        setAllProfile(res.result
          .filter(elem => filterCommonTags(myTags, elem.tags.split(','), 0)) // TODO : Keep this one ? or Only fiteredTags ?
          .filter(elem => filterCommonTags(myFilterTags, elem.tags.split(','), myFilterTags.length))
          .map(elem => {
          return({iduser : elem.id, 
            name:elem.first_name,
            photo:elem.photo1,
            tags:elem.tags})
        
      }))}
      catch(e){
        console.log("errooooooooooooooooooooooooooooooooooor")
        console.log(e)
      }
  }

  const getUserConnexion= async() =>{
    const config = {
      headers: {
        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
      },
    };
    try{
      const res = await axios.get(`http://localhost:3000/api/user/connexion`,config).then((response) => response.data);
      await axios.put(`http://localhost:3000/api/user/connexion/me/on`,{},config);
      console.log("getUserConnexion");
      console.log(res)
      
      setAllConnexion(res)
    }catch(e){
      
    }

  }

  useEffect(()=>{
    getAllProfileForFeed()
    getUserConnexion()
  },[filterParams])

  useEffect(() => {
        

        function newConnexionEnter({profileId, status}){
            console.log(`session ${profileId} ${status}`)
            setAllConnexion(prev =>({ ...prev, [profileId]: status }))
            console.log("test")
        }
        if (!socket.connected) {
        console.log("socket noco feed")

        if (!socket.connected) {
         socket.connect();
        }
        console.log("socket co feed")

        }
        
        socket.on(`newConnexion`, newConnexionEnter)

        return () => {
          socket.off(`newConnexion`)
        }
      },[]) 


    // Filter Modal

    const [open, setOpen] = useState(false);

    const onModalOpen = () => setOpen(true);
    const onModalClose = (params) => {
        console.log("Params: ", params);
        setFilterParams(params)
        setOpen(false);
    }


  return (

      <GenericPage className={styles.page}>
        <ProfileHeader menuOnly={false}/>

        {/* <AppDropdown/> */}

          <Button className={`${styles[`filterButton_${ctx.theme}`]} ${styles.filterButton}`} onClick={onModalOpen}>Filtres</Button>
          <FilterModal open={open} onClose={onModalClose} myTags={myTags}/>

        <div className={styles.allChatPage}>
          {AllProfile.map((elem, index) =>
              <FeedProfile key={index} profile={elem} isConnected={allConnexion[elem.iduser]}/>
          )}
          {!AllProfile.length && <h1>Oh non, personne ne te convient :( Essaie d'ajuster tes filtres</h1>}
        </div>
      </GenericPage>
    );
}

export default Feed;