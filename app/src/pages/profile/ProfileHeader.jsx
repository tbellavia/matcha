import React from 'react';
import styles from "./Profile.module.css";
import { base64ToFile } from "../../common/utils";
import AppDroddown from "../../components/ui/drawer-menu/AppDropdown";
import Photo from "../../components/ui/photo/Photo";
import { useTheme } from '../../hooks/use-theme';


const ProfileHeader = ({ first_name, last_name, image }) => {
    const theme = useTheme();
    const myNameTopStyle = styles[`name-top__${theme}`];
    const myNameBottomStyle = styles[`name-bottom__${theme}`];

    return (
        <nav className={styles.nav}>
            <div className={styles['nav__left-container']}>
                <Photo data={base64ToFile(image)} size="medium" />
                <div>
                    <h2 className={`${styles['name-label']} ${myNameTopStyle}`}>{first_name}</h2>
                    <h2 className={`${styles['name-label']} ${myNameBottomStyle}`}>{last_name}</h2>
                </div>
            </div>
            <div className={styles['nav__right-container']}>
                <AppDroddown />
            </div>
        </nav>
    )
}

export default ProfileHeader