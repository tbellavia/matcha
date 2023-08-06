import GenericPage from "../page/GenericPage";
import styles from "./Profile.module.scss";
import Button from "../../components/ui/button/Button";
import { useContext, useEffect, useState } from "react";
import ProfileInfos from "./components/ProfileInfos";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";
import useFetch from "../../hooks/use-fetch";
import jwtDecode from "jwt-decode";
import AppContext from "../../store/AppContext";

const getUserId = (token) => jwtDecode(token).id_user;

function Profile() {
    const { token } = useContext(AppContext);
    const fetch = useFetch();
    const [infos, setInfos] = useState({});


    useEffect(() => {
        (async function() {
            try {
                const response = await fetch(`/api/user/profile/11`);
                // console.log(response);
                setInfos(response?.data);
            } catch (e) {
                console.log("Error:", e);
            }
        })()
    })

    // console.log(infos);

    return (
        <GenericPage className={styles.profile}>
            <ProfileHeader menuOnly={true}/>

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

export default Profile;