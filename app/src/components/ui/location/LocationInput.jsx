import { useState } from "react";
import Autocomplete from "../tags/Autocomplete";
import { cities } from "../../../utils/cities";
import styles from "./LocationInput.module.css";
import Label from "../label/Label";

function LocationInput({ 
    onSubmit = () => { },
    onBlur = () => { }
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

    return (
        <div className={styles['location-input']}>
            <Label label="Localisation" htmlFor="location"/>
            <Autocomplete
                id="location" 
                suggest={suggestedCities}
                value={city}
                onChange={setCity}
                onSubmit={onSubmitHandler}
                placeholder="Paris, Île-de-France"
                onBlur={onBlurHandler}
            />
        </div>
    ); 
}

export default LocationInput;