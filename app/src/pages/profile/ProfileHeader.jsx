import React from 'react'
import styles from "./Profile.module.css";
import { base64ToFile } from "../../common/utils";
import AppDroddown from "../../components/ui/drawer-menu/AppDropdown";
import Photo from "../../components/ui/photo/Photo";
import maleImg from "../../assets/image/male.jpeg"
import { useTheme } from '../../hooks/use-theme';


const ProfileHeader = () => {
    const theme = useTheme();
    const myNameTopStyle = styles[`name-top__${theme}`];
    const myNameBottomStyle = styles[`name-bottom__${theme}`];

    return (
        <nav className={styles.nav}>
            <div className={styles['nav__left-container']}>
                <Photo data={maleImg} size="medium" />
                <div>
                    <h2 className={`${styles['name-label']} ${myNameTopStyle}`}>tony</h2>
                    <h2 className={`${styles['name-label']} ${myNameBottomStyle}`}>bellavia</h2>
                </div>
            </div>
            <div className={styles['nav__right-container']}>
                <AppDroddown />
            </div>
        </nav>
    )
}

export default ProfileHeader