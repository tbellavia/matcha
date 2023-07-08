import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import useFetch from "../../hooks/use-fetch";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import styles from "./Profile.module.scss";
import GenericPage from "../page/GenericPage";
import ProfileInfos from "./components/ProfileInfos";
import ButtonGroupMe from "./components/button-groups/ButtonGroupMe";
import ButtonGroupMatch from "./components/button-groups/ButtonGroupMatch";
import ButtonGroupFinally from "./components/button-groups/ButtonGroupFinally";


const PROFILE_ME = "me";
const PROFILE_ALREADY_ANSWERED = "alreadyAnswered";
const PROFILE_MATCH = "match";


function GenericProfile() {
    const {id} = useParams();
    const [infos, setInfos] = useState({})
    const [profileType, setProfileType] = useState();
    const profile = useProfile();

    const isMe = profileType === PROFILE_ME;
    const isMatch = profileType === PROFILE_MATCH;

    useEffect(() => {
        async function fetchProfile() {
            const result = await profile.fetch(id);

            setInfos(result.result);
            setProfileType(result.type);
        }

        fetchProfile().then()
    }, [])

    return (<GenericPage className={styles.profile}>
        <ProfileHeader menuOnly={isMe}/>

        <main className={styles['profile-container']}>
            <ProfileInfos profileInfos={infos}/>

            <div className={styles['button-container']}>
                {isMe && <ButtonGroupMe/>}
                {isMatch && <ButtonGroupMatch/>}
                {!isMe && !isMatch && <ButtonGroupFinally/>}
            </div>
        </main>
    </GenericPage>)
}

function useProfile() {
    const fetcher = useFetch();

    return {
        fetch: async function (id) {
            const response = await fetcher(`/api/user/profile/${id}`);

            return response?.data;
        }
    }
}

export default GenericProfile;