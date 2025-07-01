import { ClickAwayListener } from "@mui/material";
import AppContext from "../../../store/AppContext";
import DoubleSlider from "../Slider/DoubleSlider/DoubleSlider";
import SlingleSlider from "../Slider/SingleSlider/SlingleSlider";
import Button from "../button/Button";
import CheckboxGroup from "../checkbox/CheckboxGroup";
import RadioButtonGroup from "../radio-button/RadioButtonGroup";
import InputTagList from "../tags/InputTagList";
import styles from "./FilterModal.module.scss";
import React, { useContext, useEffect, useRef, useState } from 'react';
import useFetch from "../../../hooks/use-fetch";
import { encodePreferences, extractPreferences, decodePreferences } from "../../../common/utils";
import axios from "axios";

const MIN_AGE = 18;
const MAX_AGE = 90;
const MIN_DIST = 10;
const MAX_DIST = 1000;
const MIN_POPULARITY = 0;
const MAX_POPULARITY = 1;
const SORT_CHOICES = ["distance", "âge", "popularité"];

const FilterModal = ({
    open = false,
    onClose = (p) => { },
    myTags = [],
}) => {
    const { theme } = useContext(AppContext);
    const colorClass = styles[`modal-surface__${theme}`];
    const [preferences, setPreferences] = useState([]);
    const [ages, setAges] = useState([MIN_AGE, MAX_AGE]);
    const [distance, setDistance] = useState(MIN_DIST);
    const [tags, setTags] = useState([]);
    const [popularity, setPopularity] = useState(MAX_POPULARITY);
    const [sort, setSort] = useState(SORT_CHOICES[0]);
    const fetch = useRef(useFetch());
    const ctx = useContext(AppContext);
    const [allTags, setAllTags] = useState([]);
    const onCloseHandler = () => {
        onClose({ ages, distance, tags, popularity, sort, preferences })
    };

    const onSubmitClickedHandler = () => {
        onClose({ ages, distance, tags, popularity, sort, preferences })

        const [agemin, agemax] = ages;
        const pref = encodePreferences(extractPreferences(preferences))
        fetch.current("/api/user/filtre/me", "PUT", {
            agemin,
            agemax,
            distmax: distance,
            preference: pref,
            minrating: popularity,
            filtertags: tags,
            tri: SORT_CHOICES.indexOf(sort)
        });
        setPreferences(decodePreferences(pref))
    };

    useEffect(() => {
        const fetchFilter = async () => {
            try {
                const response = await fetch.current("/api/user/filtre/me");
                const filter = response?.data?.filter;

                if (!filter){
                    return;
                }
                setAges([filter.agemin, filter.agemax]);
                setDistance(filter.distmax);
                setTags(filter.filtertags);
                setPopularity(filter.minrating);
                setSort(SORT_CHOICES[filter.tri]);
                setPreferences(decodePreferences(filter.preference));
            } catch (e) {
                // TODO: Manage error
            }
        };
        fetchFilter();
    }, []);

    useEffect(() => {
            async function fetchData() {
                const config = {
                    headers: {
                        Authorization: `Bearer ${ctx.token}`, // ajoute le jeton d'authentification dans l'en-tête
                    },
                };
                try {
                    const res = await axios.get('http://localhost:3000/api/user/profile/tags', config);
                    setAllTags([...new Set([...myTags, ...res.data])]) // TODO : add onChange or readOnly with checked value in form
                } catch (error) {}
            }
            fetchData();
        }, [myTags]);

    return (
        <React.Fragment>
            {open &&
                <div className={styles.modal}>
                    <ClickAwayListener onClickAway={onCloseHandler}>
                        <div className={`${styles['modal-surface']} ${colorClass}`}>
                            <h1>Filtres</h1>

                            <div className={styles['modal-content']}>
                                <div className={styles["modal-input"]}>
                                    <CheckboxGroup 
                                        label="préférences" 
                                        values={["homme", "femme", "non-binaire"]}
                                        onChange={setPreferences}
                                        initial = {preferences}
                                    >
                                        
                                    </CheckboxGroup>
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
                                        label="distance maximale"
                                        value={distance}
                                        onChange={setDistance}
                                        min={MIN_DIST}
                                        max={MAX_DIST}
                                        step={50}
                                        suffix="km"
                                    />
                                </div>
                                <div className={styles["modal-input"]}>
                                    <InputTagList 
                                        initial={tags} 
                                        suggest={allTags}
                                        onChange={setTags}
                                    />
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
                                <div className={styles["modal-input"]}>
                                    <RadioButtonGroup
                                        label="tri"
                                        initial={sort}
                                        values={SORT_CHOICES}
                                        onChange={setSort}
                                        direction="horizontal"
                                    />
                                </div>
                                <Button variant="action-danger" onClick={onSubmitClickedHandler}>Valider</Button>
                            </div>
                        </div>
                    </ClickAwayListener>
                </div>
            }
        </React.Fragment>
    )
}

export default FilterModal