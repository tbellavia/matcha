import GenericPage from "../page/GenericPage";
import Header from "../../components/ui/header/Header";
import styles from "./Profile.module.css";
import tonyImg from "../../tony.jpeg";
import Photo from "../../components/ui/photo/Photo";
import IconButton from "../../components/ui/button/IconButton";
import Carousel from "../../components/ui/photo/Carousel";
import Tags from "../../components/ui/tags/Tags";
import Button from "../../components/ui/button/Button";
import Bio from "../../components/ui/bio/Bio";

function Profile() {
    return (
        <GenericPage className={styles.profile}>
            <Header variant="left"/>

                <main className={styles['profile-container']}>
                    <nav className={styles.nav}>
                        <div className={styles['nav__left-container']}>
                            <Photo data={tonyImg} size="medium"/>
                            <div>
                                <h2 className={styles['name-label']}>TONY</h2>
                                <h2 className={styles['name-label']}>LE TOMBEUR DE CES DAMES</h2>
                            </div>
                        </div>
                        <div className={styles['nav__right-container']}>
                            <IconButton iconColor="#EE8B98" label="FILTRES"/>
                            <IconButton iconColor="#EE8B98" label="CHAT"/>
                        </div>
                    </nav>

                    <div className={styles['profile-main-infos']}>
                        <div className={styles['profile-main-infos-top']}>
                            <div className={styles['profile-left-infos']}>
                                <h2 className={styles['name-label']}>TONY</h2>
                                <h2 className={styles['name-label']}>LE BEAU GOSSE</h2>
                            </div>

                            <div className={styles['profile-right-infos']}>
                                <h3>23 ans</h3>
                                <h4>100 KM</h4>
                            </div>
                        </div>
                        <div className={styles['profile-main-infos-bottom']}>
                            <Carousel tabPhotos={[tonyImg, tonyImg, tonyImg, tonyImg, tonyImg]}/>
                        </div>
                    </div>


                    <div className={styles['bio-container']}>
                        <Bio value="je suis tony le grand" disabled/>
                    </div>

                    <div className={styles['tags-container']}>
                        <Tags tags={["beer", "football", "love", "yoga"]}/>
                    </div>

                    <div className={styles['button-container']}>
                        <Button type="submit" variant="regular" className={styles['button']}>NOP</Button>
                        <Button type="submit" variant="action-danger" className={styles['button']}>OKAY</Button>
                    </div>
                </main>
        </GenericPage>
    )
}

export default Profile;