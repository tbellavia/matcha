import AddPhoto from "../../components/ui/photo/AddPhoto";
import Page from "../page/Page";
import styles from "./CreateProfile.module.css";
import Input from "../../components/ui/input/Input"
import { useState } from "react";
import DateInput from "../../components/ui/input/DateInput";
import RadioButtonGroup from "../../components/ui/radio-button/RadioButtonGroup"
import CheckboxGroup from "../../components/ui/checkbox/CheckboxGroup";
import InputTagList from "../../components/ui/tags/InputTagList";

function Box({ children }) {
    return <div className={styles['dummy-box']}>
        {children}
    </div>;
}

function CreateProfile(){
    const [name, setName] = useState("")
    const [prenom, setPrenom] = useState("")
    const [genre, setGenre] = useState([])
    const [pref, setPref] = useState([])
    const [bio, setBio] = useState("")
    const valuesGenre = ["femme","homme", "non binaire"]
    const [tags, setTags] = useState([])
    const suggestTagsList = ["un","deux"]
    const onChangeName = (e) =>{
        setName(e)
    }
    const onChangePrenom = (e) =>{
        setPrenom(e)
    }
    const onChangeGenre = (e) => {
        setGenre(e)
    }
    const onChangePref = (e) => {
        console.log(e)
        setPref(e)
    }
    const onChangeBio = (e) => {
        setBio(e)
    }
    return (
        <Page className={styles['create-profile']}>
            <section className={styles['create-profile__form']}>
                {/* Profile picture */}
                <div className={styles['create-profile__image-container']}>
                    <AddPhoto/>
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <Input label="prenom" type="text" value={prenom} onChange={onChangePrenom}></Input>
                    <Input label="nom" type="text" value={name} onChange={onChangeName}></Input>
                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <DateInput label="date de naissance"/>
                    <Input label="lieu" type="text" value="Paris"></Input>

                </div>

                {/* Input group */}
                <div className={styles['create-profile__input-container']}>
                    <div className={styles['create-profile__input-group']}>
                        <RadioButtonGroup label="genre" initial="homme" values={valuesGenre} onChange={onChangeGenre}/>
                    </div>
                    <div className={styles['create-profile__input-group']}>
                        <CheckboxGroup label="preference" values={valuesGenre} onChange={onChangePref}/>
                    </div>
                </div>

                {/* Tag group */}
                <div className={styles['create-profile__tags-container']}>
                    <InputTagList tagList={tags} setTagList={setTags}  suggest={suggestTagsList}/>
                </div>

                {/* Bio */}
                <div className={styles['create-profile__bio-container']}>
                    <Input label="bio" type="text" value={bio} onChange={onChangeBio}/>
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