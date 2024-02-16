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