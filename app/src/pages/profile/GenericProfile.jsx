import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import useFetch from "../../hooks/use-fetch";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import styles from "./Profile.module.scss";
import GenericPage from "../page/GenericPage";
import Button from "../../components/ui/button/Button";
import ProfileInfos from "./ProfileInfos";


function GenericProfile({}) {
    const { id } = useParams();
    const [infos, setInfos] = useState({})
    const [profileType, setProfileType] = useState();
    const fetch = useFetch();

    useEffect(() => {
        async function fetchProfile() {
            const uri = `/api/user/profile/${id}`;
            const response = await fetch(uri);

            console.log(response?.data);

            setProfileType(response.data.type);
            setInfos(response.data.result);
        }
        fetchProfile();
    }, []);

    const isMe = profileType == "me";

    return (
        <GenericPage>
            <ProfileHeader menuOnly={isMe}/>

            <main className={styles['profile-container']}>
                <ProfileInfos profileInfos={infos} />

                <div className={styles['button-container']}>
                    <Button type="submit" variant="regular" className={styles['button']}>NOP</Button>
                    <Button type="submit" variant="action-danger" className={styles['button']}>OKAY</Button>
                </div>
            </main>
        </GenericPage>
    )
}

export default GenericProfile;