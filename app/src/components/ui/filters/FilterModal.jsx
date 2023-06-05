import AppContext from "../../../store/AppContext";
import DoubleSlider from "../Slider/DoubleSlider/DoubleSlider";
import SlingleSlider from "../Slider/SingleSlider/SlingleSlider";
import CheckboxGroup from "../checkbox/CheckboxGroup";
import Label from "../label/Label";
import InputTagList from "../tags/InputTagList";
import Tags from "../tags/Tags";
import styles from "./FilterModal.module.scss";
import React, { useContext, useState } from 'react'

const MIN_AGE = 18;
const MAX_AGE = 90;
const MIN_DIST = 5;
const MAX_DIST = 500;
const MIN_POPULARITY = 0.1;
const MAX_POPULARITY = 1;

const FilterModal = () => {
    const { theme } = useContext(AppContext);
    const bgcolorClass = styles[`modal-surface__${theme}`];

    const [ages, setAges] = useState([MIN_AGE, MAX_AGE]);
    const [distance, setDistance] = useState(MIN_DIST);
    const [popularity, setPopularity] = useState(MAX_POPULARITY);

    return (
        <div className={styles.modal}>
            <div className={`${styles['modal-surface']} ${bgcolorClass}`}>
                <h1>Filtres</h1>

                <div className={styles['modal-content']}>
                    <div className={styles["modal-input"]}>
                        <CheckboxGroup label="préférences" values={["homme", "femme", "non binaire"]}></CheckboxGroup>
                    </div>
                    <div className={styles["modal-input"]}>
                        <DoubleSlider
                            label="âge"
                            value={ages}
                            onChange={setAges}
                            min={MIN_AGE}
                            max={MAX_AGE}
                            suffix="ans"
                        />
                    </div>
                    <div className={styles["modal-input"]}>
                        <SlingleSlider
                            label="distance"
                            value={distance}
                            onChange={setDistance}
                            min={MIN_DIST}
                            max={MAX_DIST}
                            suffix="km"
                        />
                    </div>
                    <div className={styles["modal-input"]}>
                        <InputTagList initial={["beer", "pong"]}/>
                    </div>
                    <div className={styles["modal-input"]}>
                        <SlingleSlider
                            label="popularité"
                            value={popularity}
                            onChange={setPopularity}
                            step={0.1}
                            min={MIN_POPULARITY}
                            max={MAX_POPULARITY}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterModal