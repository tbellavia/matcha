import { useReducer } from "react";
import PageHeader from "../../components/ui/page/PageHeader";
import styles from "./CreateProfile.module.css";
import _ from "lodash";

function Box({ children }) {
    return <div className={styles['dummy-box']}>
        {children}
    </div>;
}

const initialProfileState = {
    photos: [],
    firstname: null,
    lastname: null,
    birthdate: null,
    location: null,
    genre: null,
    preferences: [],
    tags: [],
    biography: null
};

function createInputReducer(validateFn) {
    return (state, action) => {
        switch (action.type) {
            case "UPDATE":
                return { ...state, value: action.value };
            case "VALIDATE":
                return { ...state, valid: validateFn(state.value) };
            default:
                throw new Error(`Unkown action '${action}'`);
        }
    }
}

const photosReducer = createInputReducer(photos => 
    photos && 
    photos.length > 1 && 
    photos.length <= 5
);
const firstnameReducer = createInputReducer(firstname => _.isEmpty(firstname));
const lastnameReducer = createInputReducer(lastname => _.isEmpty(lastname));
const genreReducer = createInputReducer(genre => _.isEmpty(genre));
const preferencesReducer = createInputReducer(prefs => _.isEmpty(prefs));
const tagsReducer = createInputReducer(tags => _.isEmpty(tags));
// TODO: Check if date is in valid range
const dateReducer = createInputReducer(date => _.isDate(date));
// TODO: Make sure location is in France
const locationReducer = createInputReducer(location => true);
// TODO: Make sure bio is valid
const biographyReducer = createInputReducer(bio => true);



function CreateProfile() {
    return (
        <PageHeader className={styles['create-profile']}>
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
        </PageHeader>
    );
}

export default CreateProfile;