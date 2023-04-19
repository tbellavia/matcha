import { useReducer, useState } from "react";
import PageHeader from "../../components/ui/page/PageHeader";
import styles from "./CreateProfile.module.css";
import _ from "lodash";
import AddPhoto from "../../components/ui/photo/AddPhoto";
import Input from "../../components/ui/input/Input";
import DateInput from "../../components/ui/input/DateInput";
import CheckboxGroup from "../../components/ui/checkbox/CheckboxGroup";
import RadioButtonGroup from "../../components/ui/radio-button/RadioButtonGroup";
import InputTagList from "../../components/ui/tags/InputTagList";
import Button from "../../components/ui/button/Button";
import LocationInput from "../../components/ui/location/LocationInput";
import BioInput from "../../components/ui/input/BioInput";

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

const genres = ["homme", "femme", "non binaire"];
// TODO: remove hard coded suggests
const dummySuggests = ["beer", "baseball", "football", "yoga", "healthy"];

function CreateProfile() {
    const [val, setVal] = useState("");

    return (
        <PageHeader className={styles['create-profile']}>
            <section className={styles['create-profile__form']}>
                {/* Profile picture */}
                <div className={styles['create-profile__image-container']}>
                    <AddPhoto />
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <Input label="Prénom" placeholder="John"/>
                    <Input label="Nom" placeholder="Doe"/>
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <DateInput label="Date de naissance"/>
                    <LocationInput/>
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <div className={styles['create-profile__input-group']}>
                        <RadioButtonGroup label="Genre" initial="homme" values={genres}/>
                    </div>
                    <div className={styles['create-profile__input-group']}>
                        <CheckboxGroup label="Préférences" values={genres}/>
                    </div>
                </div>

                {/* Tag group */}
                <div className={styles['create-profile__tags-container']}>
                    <InputTagList value={dummySuggests} suggest={dummySuggests}/>
                </div>

                {/* Bio */}
                <div className={styles['create-profile__bio-container']}>
                    <BioInput value={val} onChange={setVal} limit={300}/>
                </div>

                {/* Button */}
                <div className={styles['create-profile__button-container']}>
                    <Button variant="validation">valider</Button>
                </div>
            </section>
        </PageHeader>
    );
}

export default CreateProfile;