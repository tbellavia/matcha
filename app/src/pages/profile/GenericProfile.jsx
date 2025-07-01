import {useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../hooks/use-fetch";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import styles from "./Profile.module.scss";
import GenericPage from "../page/GenericPage";
import ProfileInfos from "./components/ProfileInfos";
import ButtonGroupMe from "./components/button-groups/ButtonGroupMe";
import ButtonGroupMatch from "./components/button-groups/ButtonGroupMatch";
import ButtonGroupFinally from "./components/button-groups/ButtonGroupFinally";
import ButtonGroupWaiting from "./components/button-groups/ButtonGroupWaiting";
import axios from "axios";
import AppContext from "../../store/AppContext";

const PROFILE_ME = "me";
const PROFILE_ALREADY_ANSWERED = "alreadyAnswered";
const PROFILE_MATCH = "match";
const PROFILE_BLOCKED = "blocked";


function GenericProfile() {
    const {id} = useParams();
    const [infos, setInfos] = useState({})
    const [profileType, setProfileType] = useState();
    const profile = useProfile();
    const [allConnexion, setAllConnexion] = useState({})
    const ctx = useContext(AppContext)
    const navigate = useNavigate()

    const isMe = profileType === PROFILE_ME;
    const isMatch = profileType === PROFILE_MATCH;
    const isAlreadyAnswered = profileType === PROFILE_ALREADY_ANSWERED;
    const isBlocked = profileType === PROFILE_BLOCKED;

    const getUserConnexion= async() =>{
        const config = {
        headers: {
            Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête d'autorisation
        },
        };
        try{
        const res = await axios.get(`http://localhost:3000/api/user/connexion`,config).then((response) => response.data);
        await axios.put(`http://localhost:3000/api/user/connexion/me/on`,{},config);
        setAllConnexion(res)
        }catch(e){
        
        }

    }

    useEffect(() => {
        getUserConnexion()
        try {

            async function fetchProfile() {
                const result = await profile.fetch(id);

                setInfos(result.result);
                setProfileType(result.type);
            }

            fetchProfile().then()
        }
        catch (err) {
            return null
        }

    }, [id])

    useEffect(() => {
        if (isBlocked)
            navigate("/feed");
    }, [profileType])

    return (
        <GenericPage className={styles.profile}>
            <ProfileHeader menuOnly={isMe}/>

            {!isBlocked &&
                <main className={styles['profile-container']}>
                    <ProfileInfos profileInfos={infos} isConnected={allConnexion[id]}/>

                    <div className={styles['button-container']}>
                        {isMe && <ButtonGroupMe/>}
                        {isMatch && <ButtonGroupMatch/>}
                        {!isMe && !isMatch && !isAlreadyAnswered &&
                            <ButtonGroupFinally profileID={id}/>
                        }
                        {!isMe && !isMatch && isAlreadyAnswered && <ButtonGroupWaiting profileID={id}/>}
                    </div>
                </main>
            }
        </GenericPage>
    )
}

function useProfile() {
    const fetcher = useFetch();
    const navigate = useNavigate()

    return {
        fetch: async function (id) {
             try {
                const response = await fetcher(`/api/user/profile/${id}`);
                return response?.data;
             }
            catch (err) {
                navigate(`/feed`);
                return null
        }
        }
    }
}

export default GenericProfile;