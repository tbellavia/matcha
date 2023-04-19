import { useState } from "react";
import Autocomplete from "../tags/Autocomplete";
import { cities } from "../../../utils/cities";
import styles from "./LocationInput.module.css";

function LocationInput({ 
    onChange = () => {}
}) {
    const [city, setCity] = useState("");
    const [suggestedCities] = useState(cities.map(val => `${val.city}, ${val.region}`));

    const onBlur = (val) => {
        console.log(val);
        setCity(val);
    }

    return (
        <div className={styles['location-input']}>
            <label htmlFor="location">Localisation</label>
            <Autocomplete
                id="location" 
                suggest={suggestedCities}
                value={city}
                onChange={setCity}
                onSubmit={onBlur}
                placeholder="Paris, Île-de-France"
            />
        </div>
    ); 
}

export default LocationInput;