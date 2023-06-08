import React, { useContext, useEffect, useState } from 'react';
import styles from "./ProfileHeader.module.scss";
import { base64ToFile } from "../../../../common/utils";
import AppDroddown from "../../drawer-menu/AppDropdown";
import Photo from "../../photo/Photo";
import Header from '../../header/Header';
import AppContext from '../../../../store/AppContext';
import useFetch from '../../../../hooks/use-fetch';

/**
 * ProfileHeader
 * 
 * ProfileHeader component is a subheader responsible of showing to the user
 * its own informations.
 * In some cases, we only want to show the menu, if it is the case, the `menuOnly'
 * property allow to specify if the user part must be shown or not.
 */
const ProfileHeader = ({ menuOnly = false }) => {
    const { token, theme } = useContext(AppContext);
    const myNameTopStyle = styles[`name-top__${theme}`];
    const myNameBottomStyle = styles[`name-bottom__${theme}`];
    const fetch = useFetch();
    const [infos, setInfos] = useState({});

    useEffect(() => {
        // TODO: Store those infos in localStorage ?
        if (!menuOnly) {
            (async function(){
                try {
                    const response = await fetch("/api/user/profile/me");
                    setInfos(response?.data);
                } catch (e) {
                    // TODO: Manage error
                    console.log("Error:", e);
                }
            })()
        }
    }, [token, fetch, menuOnly]);

    return (
        <Header variant='left'>
            <nav className={styles.nav}>
                {!menuOnly &&
                    <div className={styles['nav__left-container']}>
                        <Photo data={base64ToFile(infos.photo1)} size="medium" />
                        <div>
                            <h2 className={`${styles['name-label']} ${myNameTopStyle}`}>{infos.first_name}</h2>
                            <h2 className={`${styles['name-label']} ${myNameBottomStyle}`}>{infos.last_name}</h2>
                        </div>
                    </div>
                }
                <div className={styles['nav__right-container']}>
                    <AppDroddown />
                </div>
            </nav>
        </Header>
    )
}

export default ProfileHeader