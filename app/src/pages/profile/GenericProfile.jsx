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
const PROFILE_BLOCKED = "blocked";


function GenericProfile() {
    const {id} = useParams();
    const [infos, setInfos] = useState({})
    const [profileType, setProfileType] = useState();
    const profile = useProfile();

    const isMe = profileType === PROFILE_ME;
    const isMatch = profileType === PROFILE_MATCH;
    const isAlreadyAnswered = profileType === PROFILE_ALREADY_ANSWERED;
    const isBlocked = profileType === PROFILE_BLOCKED;

    useEffect(() => {
        async function fetchProfile() {
            const result = await profile.fetch(id);

            setInfos(result.result);
            setProfileType(result.type);
        }

        fetchProfile().then()
    }, [id])

    return (
        <GenericPage className={styles.profile}>
            <ProfileHeader menuOnly={isMe}/>

            {!isBlocked &&
                <main className={styles['profile-container']}>
                    <ProfileInfos profileInfos={infos}/>

                    <div className={styles['button-container']}>
                        {isMe && <ButtonGroupMe/>}
                        {isMatch && <ButtonGroupMatch/>}
                        {!isMe && !isMatch && !isAlreadyAnswered &&
                            <ButtonGroupFinally profileID={id}/>
                        }
                    </div>
                </main>
            }
        </GenericPage>
    )
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