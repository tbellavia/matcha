import GenericPage from "../page/GenericPage";
import styles from "./Profile.module.scss";
import Button from "../../components/ui/button/Button";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../store/AppContext";
import ProfileInfos from "./ProfileInfos";
import ProfileHeader from "../../components/ui/profile/ProfileHeader/ProfileHeader";

function Profile() {
    const { token } = useContext(AppContext);
    const [profileInfos, setProfileInfos] = useState({});

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/profile/me", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setProfileInfos(response?.data);
            } catch (e) {
                console.log("Error:", e);
            }
        }

        fetch();
    }, [token])

    return (
        <GenericPage className={styles.profile}>
            <ProfileHeader />

            <main className={styles['profile-container']}>
                <ProfileInfos profileInfos={profileInfos} />

                <div className={styles['button-container']}>
                    <Button type="submit" variant="regular" className={styles['button']}>NOP</Button>
                    <Button type="submit" variant="action-danger" className={styles['button']}>OKAY</Button>
                </div>
            </main>
        </GenericPage>
    )
}

export default Profile;