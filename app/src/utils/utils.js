export function getFirstError(errors) {
    let errorsKeys = Object.keys(errors);

    if (errorsKeys.length !== 0) {
        return errors[errorsKeys[0]].message;
    }
    return false;
}

export function getUserLocation() {
    navigator.geolocation.getCurrentPosition(
        saveUserLocation,
        () => {},
        {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: Infinity,
        }
    );
}

function saveUserLocation(position) {
    const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    };
    localStorage.setItem("location", JSON.stringify(userLocation));
}

export function getUserLocationFromLocalStorage() {
    const storedLocation = localStorage.getItem("location");

    if (storedLocation) {
        return JSON.parse(storedLocation);
    }
    return null;
}

export function encodePreferences(preferences) {
    // const genders = {"male": 1, "female": 2, "non-binary": 4};
    // let result = 0;

    // for (const preference of filteredPreferences)
    //     result += genders[preference]
    return Object
        .entries(preferences)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);
}

export function encodeGender(gender) {
    const genders = {
        "male": 1,
        "female": 2,
        "non-binary": 4,
    }
    return genders[gender];
}

export function decodeGender(gender) {

}

export function tagsToList(tags) {
    return tags.split(",");
}