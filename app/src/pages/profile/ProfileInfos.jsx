import React from 'react';
import styles from "./Profile.module.css";
import Tags from '../../components/ui/tags/Tags';
import Bio from '../../components/ui/bio/Bio';
import Carousel from '../../components/ui/photo/Carousel';
import { useTheme } from '../../hooks/use-theme';

const ProfileInfos = ({profileInfos}) => {
    const theme = useTheme();
    const navLabelColor = styles[`nav-color__${theme}`];

    return (
        <React.Fragment>
            <div className={`${styles['profile-main-infos']} ${navLabelColor}`}>
                <div className={styles['profile-main-infos-top']}>
                    <div className={styles['profile-left-infos']}>
                        <h2 className={styles['name-label']}>{profileInfos.first_name}</h2>
                        <h2 className={styles['name-label']}>{profileInfos.last_name}</h2>
                    </div>

                    <div className={styles['profile-right-infos']}>
                        <h3>{profileInfos.age} ans</h3>
                        <h4>{profileInfos.distance} KM</h4>
                    </div>
                </div>
                <div className={styles['profile-main-infos-bottom']}>
                    <Carousel tabPhotos={[profileInfos.photo1, profileInfos.photo2, profileInfos.photo3, profileInfos.photo4, profileInfos.photo5]} />
                </div>
            </div>


            <div className={styles['bio-container']}>
                <Bio value={profileInfos.biograpy} disabled />
            </div>

            <div className={styles['tags-container']}>
                {/* TODO: Remove brackets when back returns array */}
                <Tags tags={[profileInfos.tags]} />
            </div>
        </React.Fragment>
    )
}

export default ProfileInfos