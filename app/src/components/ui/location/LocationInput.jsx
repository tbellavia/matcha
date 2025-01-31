import { useState } from "react";
import Autocomplete from "../tags/Autocomplete";
import { cities } from "../../../utils/cities";
import styles from "./LocationInput.module.css";
import Label from "../label/Label";
import Icon from "../icons/Icon";

function LocationInput({ 
    onSubmit = () => { },
    onBlur = () => { },
    placeholder="Paris, Île-de-France"
}) {
    const [city, setCity] = useState("");
    const [suggestedCities] = useState(Object.keys(cities));

    const onSubmitHandler = (val) => {
        setCity(val);
        onSubmit(cities[val]);
    }

    const onBlurHandler = (val) => {
        onBlur(cities[val]);
    }

    const onLocationIconClicked = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCity("Votre localisation a été récupérée avec succès !");
            onSubmit({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
        });
    }

    return (
        <div className={styles['location-input']}>
            <Label label="Localisation" htmlFor="location"/>
            <div className={styles['location-input__container']}>
                <Icon 
                    className={styles['location-input__icon']} 
                    variant="position"
                    onClick={onLocationIconClicked}
                />
                <Autocomplete
                    id="location" 
                    suggest={suggestedCities}
                    value={city}
                    onChange={setCity}
                    onSubmit={onSubmitHandler}
                    placeholder={placeholder}
                    onBlur={onBlurHandler}
                />
            </div>
        </div>
    ); 
}

export default LocationInput;