import { QueryBuilder, Favorite, HeartBroken } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
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
const PROFILE_ALREADY_UNLIKED = "alreadyUnliked";
const PROFILE_ALREADY_LIKED = "alreadyLiked";
const PROFILE_MATCH = "match";
const PROFILE_BLOCKED = "blocked";

const iconColor = "var(--color-light-8)";
const loveIcons = [<QueryBuilder sx={{ color: iconColor }} />, <Favorite sx={{ color: iconColor }} />, <HeartBroken sx={{ color: iconColor }} />]

function GenericProfile() {
    const { id } = useParams();
    const [infos, setInfos] = useState({})
    const [profileType, setProfileType] = useState();
    const [loveState, setLoveState] = useState([0,0]);
    const profile = useProfile();
    const [allConnexion, setAllConnexion] = useState({})
    const ctx = useContext(AppContext)
    const navigate = useNavigate()

    const isMe = profileType === PROFILE_ME;
    const isMatch = profileType === PROFILE_MATCH;
    const isAlreadyLiked = profileType === PROFILE_ALREADY_LIKED;
    const isAlreadyUnliked = profileType === PROFILE_ALREADY_UNLIKED;
    const isBlocked = profileType === PROFILE_BLOCKED;

    const getUserConnexion = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${ctx.token}`,
            },
        };
        try {
            const res = await axios.get(`http://localhost:3000/api/user/connexion`, config);
            await axios.put(`http://localhost:3000/api/user/connexion/me/on`, {}, config);
            setAllConnexion(res.data);
        } catch (e) {

        }

    }

    useEffect(() => {
        getUserConnexion()
        try {

            async function fetchProfile() {
                const result = await profile.fetch(id);

                setInfos(result.result);
                setProfileType(result.type);
                setLoveState(result.love);
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
            <ProfileHeader menuOnly={isMe} />
            {!isBlocked &&
                <main className={styles['profile-container']}>
                    {loveIcons[loveState[0]]} {loveIcons[loveState[1]]}
                    <ProfileInfos profileInfos={infos} isConnected={allConnexion[id]} />
                    <div className={styles['button-container']}>
                        {isMe && <ButtonGroupMe />}
                        {isMatch && <ButtonGroupMatch />}
                        {!isMe && !isMatch && !isAlreadyLiked && !isAlreadyUnliked &&
                            <ButtonGroupFinally profileID={id} />
                        }
                        {!isMe && !isMatch && (isAlreadyLiked || isAlreadyUnliked) && <ButtonGroupWaiting profileID={id} liked={isAlreadyLiked} />}
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