import React from 'react';
import styles from "./ProfileInfos.module.scss";
import Tags from '../../../components/ui/tags/Tags';
import Bio from '../../../components/ui/bio/Bio';
import Carousel from '../../../components/ui/photo/Carousel';
import {useTheme} from '../../../hooks/use-theme';

const ratingColor = ['rating0-20', 'rating20-40','rating40-60','rating60-80','rating80-100']

const chooseGenre = ['', 'Homme', 'Femme', '', 'Non-binaire']

const ProfileInfos = ({profileInfos, isConnected}) => {
    const theme = useTheme();
    const navLabelColor = styles[`nav-color__${theme}`];
    const {
        tags = [], rating,biography, photo1, distance, photo3, photo2, photo4, photo5, age, last_name, first_name, genre
    } = profileInfos;


    const connected = () => {
        if(isConnected === true){
            return <div className={styles.connecttrue}> </div>
        }
        else if(isConnected){
            return <div className={styles.connectfalse}>{isConnected}</div>
        }
        return
    }



    return (<React.Fragment>
            <div className={`${styles['profile-main-infos']} ${navLabelColor}`}>
                <div className={styles['profile-main-infos-top']}>
                    <div className={styles['profile-left-infos']}>
                        <h2 className={styles['name-label']}>{first_name}</h2>
                        <h2 className={styles['name-label']}>{last_name}</h2>
                        <div className={styles[`${ratingColor?.[Math.floor(rating * 5)] || 'rating40-60'}__${theme || 'light'}`]}></div>
                    </div>
                    {connected()}

                    <div className={styles['profile-right-infos']}>
                        <h3>{Math.floor(age)} ans</h3>
                        <h4>{Math.floor(distance)} KM</h4>
                    </div>
                </div>
                <div className={styles['profile-main-infos-bottom']}>
                    <Carousel tabPhotos={[photo1, photo2, photo3, photo4, photo5]}/>
                </div>
                <h2 className='name-label'>{chooseGenre[genre]}</h2>
            </div>


            <div className={styles['bio-container']}>
                <Bio value={biography} disabled/>
            </div>

            <div className={styles['tags-container']}>
                <Tags tags={tags}/>
            </div>
        </React.Fragment>)
}

export default ProfileInfos