import { useState } from "react";
import Autocomplete from "../tags/Autocomplete";
import { cities } from "../../../utils/cities";

function LocationInput({ onChange }) {
    const [city, setCity] = useState("");
    const [suggestedCities, setSuggestedCities] = useState(cities.map(val => `${val.city}, ${val.region}`));

    const onBlur = (val) => {
        console.log(val);
        setCity(val);
    }

    return (
        <Autocomplete 
            suggest={suggestedCities}
            input={city}
            setInput={setCity}
            valideValue={onBlur}
        />
    ); 
}

export default LocationInput;