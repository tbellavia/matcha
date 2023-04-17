import Page from "../page/Page";
import styles from "./CreateProfile.module.css";

function Box({ children }) {
    return <div className={styles['dummy-box']}>
        {children}
    </div>;
}

function CreateProfile() {
    return (
        <Page className={styles['create-profile']}>
            <section className={styles['create-profile__form']}>
                {/* Profile picture */}
                <div className={styles['create-profile__image-container']}>
                    <Box />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <Box />
                    <Box />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <Box />
                    <Box />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <div className={styles['create-profile__input-group']}>
                        <Box />
                    </div>
                    <div className={styles['create-profile__input-group']}>
                        <Box />
                    </div>
                </div>

                {/* Tag group */}
                <div className={styles['create-profile__tags-container']}>
                    <Box />
                </div>

                {/* Bio */}
                <div className={styles['create-profile__bio-container']}>
                    <Box />
                </div>

                {/* Button */}
                <div className={styles['create-profile__button-container']}>
                    <button>valider</button>
                </div>
            </section>
        </Page>
    );
}

export default CreateProfile;